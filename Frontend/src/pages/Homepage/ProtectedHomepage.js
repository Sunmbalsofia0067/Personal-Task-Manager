import {Route} from 'react-router-dom'

export default ProtectedHomepage = ({children, ...rest})=>{
    let token = JSON.parse(localStorage.getItem('access_token'));
    // console.log()
    return(
        <Route {...rest}>
        (!token)
        </Route>
    );   

}