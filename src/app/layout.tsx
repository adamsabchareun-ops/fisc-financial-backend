import React from 'react';
import '../index.css'; // or where your global css is

export const metadata = {
    title: 'Fisc Financial',
    description: 'Secure Backend Bridge',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
