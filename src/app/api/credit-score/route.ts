import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse 
    const body = await request.json();
    const { fullname, mobile, loanType } = body;

    // Validate 
    if (!fullname || !mobile || !loanType) {
      return NextResponse.json(
        {
          status: false,
          msg: "Missing required fields: fullname, mobile, or loanType",
        },
        { status: 400 }
      );
    }

    // Validate mobile
    if (mobile.length < 10) {
      return NextResponse.json(
        {
          status: false,
          msg: "Invalid mobile number format",
        },
        { status: 400 }
      );
    }

    // delay 1.5 sec
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response
    // Her :: Rahil bhai add logic to fetch real score later
    return NextResponse.json(
      {
        status: true,
        score: 680,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      {
        status: false,
        msg: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
