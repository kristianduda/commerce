import { ajax } from '@extropysk/payload';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return NextResponse.json({ message: 'Cart not found.' }, { status: 404 });
  }

  try {
    const url = `${process.env.CMS_URL}/api/carts/${cartId}/checkout`;
    const order = await ajax<any>(url, 'POST', {});

    return NextResponse.redirect(order.redirectUrl, 303);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: err.statusCode });
  }
}
