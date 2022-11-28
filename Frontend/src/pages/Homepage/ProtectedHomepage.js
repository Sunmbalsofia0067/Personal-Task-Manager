import {Route} from 'react-router-dom'

export default ProtectedHomepage = ({children, ...rest})=>{
    let token = JSON.parse(localStorage.getItem('access_token'));
    return(
        <Route {...rest}>
        (!token)
        </Route>
    );   

}