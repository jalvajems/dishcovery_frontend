import { homeApi } from "@/api/authApi"
import { useEffect } from "react"

function Home() {
  useEffect(()=>{
    homeApi()
  },[])
  return (
    <div>Home</div>
  )
}

export default Home