import { NextRequest, NextResponse } from 'next/server';
import { StringConstants } from '@/utils/constants';
import User from '@/app/models/User';
import dbConnect from '@/lib/db';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { userId: string } }
// ) {
//   const { userId } = params;

//   if (!userId) {
//     return NextResponse.json({ error: 'userId is required' }, { status: 400 });
//   }

//   try {
//     await dbConnect();

//     const user = await User.findById(userId);

//     if (!user) {
//       return NextResponse.json({ error: StringConstants.USER_NOT_FOUND }, { status: 404 });
//     }

//     // Include firstName and lastName in the response
//     return NextResponse.json(
//       { user: { email: user.email, firstName: user.firstName, lastName: user.lastName } },
//       { status: 200 }
//     );
    
//   } catch (error) {
//     console.error('Search error:', error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
//       { status: 500 }
//     );
//   }
// }


export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const data = await req.json();
    const { firstName, lastName } = data;

    const user = await User.findByIdAndUpdate(userId, { firstName, lastName }, { new: true });

    if (!user) {
      return NextResponse.json({ error: StringConstants.USER_NOT_FOUND }, { status: 404 });
    }

    return NextResponse.json({ user: { email: user.email } }, { status: 200 });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
