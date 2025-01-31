import {
  SignedIn,
  SignedOut,
  SignOutButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
      {/* 로그아웃된 상태에서는 회원가입 버튼  */}
      <SignedOut>
        <SignUpButton>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            회원가입
          </button>
        </SignUpButton>
      </SignedOut>

      <UserButton />

      {/* 로그인된 상태에서는 로그아웃 버튼 */}
      <SignedIn>
        <SignOutButton>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            로그아웃
          </button>
        </SignOutButton>
      </SignedIn>
    </div>
  )
}
