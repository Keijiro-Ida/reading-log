import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  // 既存ユーザーのチェック
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: '既に登録されています' }, { status: 400 });
  }

  // パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // ユーザー作成
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || '',
    },
  });

  return NextResponse.json({ ok: true });
}
