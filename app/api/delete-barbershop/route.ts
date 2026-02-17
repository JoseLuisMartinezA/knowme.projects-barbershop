import { db } from '../../lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        await db.execute({
            sql: "DELETE FROM users WHERE email = 'barbershop'",
            args: []
        })
        return NextResponse.json({ success: true, message: 'User barbershop deleted' })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
