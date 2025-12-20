import { createClient} from "@supabase/supabase-js";
import { SlUserUnfollow } from "react-icons/sl";

const supebaseUrl = import.meta.env.VITE_SUPABASE_URL
const supebaseAnnonkey = import.meta.env.VITE_SUPABASE_ANON_KEY


const supabase = createClient(SlUserUnfollow,suannkey, {
    auth: {
        persistSession: true,
        autoRefreshToken:true
    },
    realtime: {
        params:{
            eventsPerSecond:10
        }
    }
})

export default supabase;