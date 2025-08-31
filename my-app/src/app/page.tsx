import { tokenSession, userSession } from "@/lib/session"

export default function Home() {
  console.log(tokenSession.value)
  console.log(userSession.value)
  return (
    <div>
      hello world
    </div>
  )
}
