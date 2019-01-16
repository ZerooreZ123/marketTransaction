import React, { Component } from 'react';
import {Route,Switch,NavLink,Redirect} from 'react-router-dom';
import Error from '../Error';
import ComprehensivePlate from './ComprehensivePlate';
import OptionalStock from './OptionalStock';

//路由配置
export default class Quotes extends Component{
    render (){
        return (
            <div className='homeContent'>
                <ul className='menu'>
                    <li>
                        <NavLink
                            to='/quotes/comprehensivePlate'
                            activeClassName='active'>
                            综合板块
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/quotes/optionalStock'
                            activeClassName='active'>
                            自选
                        </NavLink>
                    </li>
                </ul>
                <Switch>
                    <Route
                        exact
                        path='/quotes/comprehensivePlate'
                        component={ComprehensivePlate}
                    />
                    <Route
                        exact
                        path='/quotes/optionalStock'
                        component={OptionalStock}
                    />
                    <Redirect
                        exact
                        path='/quotes'
                        to='/quotes/comprehensivePlate'
                    />
                    <Route component={Error} />
                </Switch>
            </div>
        )
    }
}