// import { useEffect } from "react";
// import { useNavigate as useRouter } from "react-router-dom";

// const withAuth = (WrappedComponent) => {
//     const AuthComponent = (props) => {
//         const router = useRouter();

//         const isAuthenticated = () => {
//             if(localStorage.getItem("token")) {
//                 return true;
//             }
//             return false;
//         }

//         useEffect(() => {
//             if(!isAuthenticated()) {
//                 router("/auth");
               
//             }
//         }, []);

//         return <WrappedComponent {...props} />;
//     }
//     return AuthComponent;
// }

// export default withAuth;


import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const withAuth = (WrappedComponent ) => {
    const AuthComponent = (props) => {
        const router = useNavigate();

        const isAuthenticated = () => {
            if(localStorage.getItem("token")) {
                return true;
            } 
            return false;
        }

        useEffect(() => {
            if(!isAuthenticated()) {
                router("/auth")
            }
        }, [])

        return <WrappedComponent {...props} />
    }

    return AuthComponent;
}

export default withAuth;