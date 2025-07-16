"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/app/_lib/supabase";
import { generateBlobUrlFromBase64Auto } from "@/app/_lib/data";

export function useTracks() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  const tracksQuery = useQuery({
    queryKey: ["tracks"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("TRACKS")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching tracks:", error);
          return [];
        }

        const processedTracks = (data || []).map((track) => {
          let audioUrl = track.mp3_url; // Default fallback

          if (track.base64_data) {
            try {
              // Generate blob URL for better audio playback
              const blobUrl = generateBlobUrlFromBase64Auto(track.base64_data);
              audioUrl = blobUrl || track.mp3_url;
            } catch (error) {
              console.error(
                "Error generating blob URL for track:",
                track.id,
                error
              );
              audioUrl = track.mp3_url;
            }
          }

          return {
            ...track,
            audioUrl,
            originalDataUrl: track.mp3_url,
            // Add a unique key to help with re-rendering
            audioKey: `${track.id}-${Date.now()}`,
          };
        });

        return processedTracks;
      } catch (err) {
        console.error("Error in fetchTracks:", err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Force refetch on window focus to ensure fresh data
    refetchOnWindowFocus: true,
  });

  // Current track query
  const currentTrackQuery = useQuery({
    queryKey: ["currentTrack"],
    queryFn: () => queryClient.getQueryData(["currentTrack"]) || null,
    initialData: null,
  });

  // Handle loading
  useEffect(() => {
    if (!tracksQuery.isFetching && !tracksQuery.isLoading) {
      setIsLoading(false);
    }
  }, [tracksQuery.isFetching, tracksQuery.isLoading]);

  // Add or update a track locally
  const addTrackMutation = useMutation({
    mutationFn: async (trackData) => {
      return trackData;
    },
    onSuccess: (newTrack) => {
      queryClient.setQueryData(["tracks"], (oldTracks = []) => {
        const trackExists = oldTracks.some(
          (track) => track.id === newTrack.trackId
        );

        if (trackExists) {
          return oldTracks.map((track) =>
            track.id === newTrack.trackId
              ? {
                  ...track,
                  ...newTrack,
                  audioKey: `${newTrack.trackId}-${Date.now()}`, // Update audio key
                }
              : track
          );
        } else {
          const formattedTrack = {
            id: newTrack.trackId,
            title: newTrack.title,
            audioUrl: newTrack.audioUrl,
            mp3_url: newTrack.audioUrl,
            status: "completed",
            created_at: new Date().toISOString(),
            audioKey: `${newTrack.trackId}-${Date.now()}`,
          };

          return [formattedTrack, ...oldTracks];
        }
      });

      queryClient.setQueryData(["currentTrack"], newTrack);
    },
  });

  const setCurrentTrack = (track) => {
    // Ensure we have a valid audio URL
    if (track && (!track.audioUrl || track.audioUrl === "undefined")) {
      console.warn("Track missing valid audioUrl:", track);
      // Try to find the track in our tracks list to get the correct audioUrl
      const tracks = queryClient.getQueryData(["tracks"]) || [];
      const fullTrack = tracks.find((t) => t.id === track.trackId);
      if (fullTrack) {
        track = {
          ...track,
          audioUrl: fullTrack.audioUrl,
          audioKey: fullTrack.audioKey,
        };
      }
    }

    queryClient.setQueryData(["currentTrack"], track);
  };

  const refreshTracks = () => {
    return queryClient.invalidateQueries({
      queryKey: ["tracks"],
    });
  };

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      const tracks = queryClient.getQueryData(["tracks"]) || [];
      tracks.forEach((track) => {
        if (track.audioUrl && track.audioUrl.startsWith("blob:")) {
          URL.revokeObjectURL(track.audioUrl);
        }
      });
    };
  }, [queryClient]);

  return {
    tracks: tracksQuery.data || [],
    currentTrack: currentTrackQuery.data,
    addTrack: addTrackMutation.mutate,
    setCurrentTrack,
    refreshTracks,
    isLoading: isLoading || tracksQuery.isLoading,
  };
}
