import { getModels } from "@/lib/utils";
import { NextResponse } from "next/server";
export const GET = async () => {
    const models = getModels();
    return NextResponse.json(models)
}