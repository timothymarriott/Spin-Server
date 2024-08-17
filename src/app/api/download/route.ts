import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { EnsureDBConnection } from '~/server/db';

export async function GET(req: NextRequest) {
    return EnsureDBConnection(async () => {
        const {searchParams} = new URL(req.url);

        if (!searchParams.has("id")){
            return NextResponse.json({ error: "Invalid Params" }, { status: 500 });
        }

        // Define the path to the file you want to serve
        const filePath = path.join(process.cwd(), 'public', 'uploads', searchParams.get("id") + '.lvl');

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return new NextResponse('File not found', { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);

        // Set the headers to trigger a download in the browser
        const headers = new Headers();
        headers.set('Content-Type', 'application/octet-stream');
        headers.set('Content-Disposition', 'attachment; filename="' + searchParams.get("id") + ".lvl");

        // Return the file as a response
        return new NextResponse(fileBuffer, {
            headers,
        });
    });
}
