import "./globals.css";

import QueryProviders from "./_components/QueryProviders";

export const metadata = {
  title: "BeatBot Studio - Made By Jay",
  description: "BeatBot Studio - ",
  icons: {
    icon: "/BeatBot.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
