"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/app/_lib/supabase";
import { useSession } from "next-auth/react";

export function useTracks() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const tracksQuery = useQuery({
    queryKey: ["tracks", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) {
        return [];
      }

      try {
        // First, get the user id from email
        const { data: userData, error: userError } = await supabase
          .from("USER_ACCOUNTS")
          .select("id")
          .eq("email", session.user.email)
          .single();

        if (userError || !userData) {
          console.error("Error finding user by email:", userError);
          return [];
        }

        // Then get the tracks for this user
        const { data, error } = await supabase
          .from("TRACKS")
          .select("*")
          .eq("user_id", userData.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching tracks:", error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error("Error in fetchTracks:", err);
        return [];
      }
    },
    enabled: !!session?.user?.email,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query for current track - FIX: Added a queryFn that just returns the current data
  const currentTrackQuery = useQuery({
    queryKey: ["currentTrack"],
    // Add a simple queryFn that returns the existing data
    queryFn: () => queryClient.getQueryData(["currentTrack"]) || null,
    initialData: null,
  });

  // Effect to handle loading state
  useEffect(() => {
    if (session?.user?.email) {
      if (!tracksQuery.isFetching && !tracksQuery.isLoading) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [tracksQuery.isFetching, tracksQuery.isLoading, session]);

  // Mutation to add a new track
  const addTrackMutation = useMutation({
    mutationFn: async (trackData) => {
      return trackData; // Just pass through the data
    },
    onSuccess: (newTrack) => {
      // Update the tracks list with the new track
      queryClient.setQueryData(
        ["tracks", session?.user?.email],
        (oldTracks = []) => {
          const trackExists = oldTracks.some(
            (track) => track.id === newTrack.trackId
          );

          if (trackExists) {
            return oldTracks.map((track) =>
              track.id === newTrack.trackId ? { ...track, ...newTrack } : track
            );
          } else {
            const formattedTrack = {
              id: newTrack.trackId,
              title: newTrack.title,
              genre: newTrack.genre,
              audio_url: newTrack.audioUrl,
              status: "completed",
              created_at: new Date().toISOString(),
            };

            return [formattedTrack, ...oldTracks];
          }
        }
      );

      // Set as current track
      queryClient.setQueryData(["currentTrack"], newTrack);
    },
  });

  // Function to set current track
  const setCurrentTrack = (track) => {
    queryClient.setQueryData(["currentTrack"], track);
  };

  // Function to refresh tracks
  const refreshTracks = () => {
    return queryClient.invalidateQueries({
      queryKey: ["tracks", session?.user?.email],
    });
  };

  return {
    tracks: tracksQuery.data || [],
    currentTrack: currentTrackQuery.data,
    addTrack: addTrackMutation.mutate,
    setCurrentTrack,
    refreshTracks,
    isLoading: isLoading || tracksQuery.isLoading,
  };
}
