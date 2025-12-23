import { useAuth } from "../contexts/AuthContext";

export default function UnAuthenticatedRoute({children, redirectTo="/"}){



    const {} = useAuth();
}