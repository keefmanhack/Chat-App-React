import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router';
import { Grid, Row, Col } from 'rsuite';
import SideBar from '../../Components/SideBar';
import { RoomsProivder } from '../../Context/rooms.context';
import { useMediaQuery } from '../../misc/customHooks';
import { Chat } from './Chat';

const Home = () => {
    const isDesktop = useMediaQuery('(min-width: 992px)');
    const {isExact} = useRouteMatch();

    const canRenderSidebar = isDesktop || isExact;
    
    return (
        <RoomsProivder>
            <Grid fluid className='h-100'>
                <Row className='h-100'>
                    {canRenderSidebar &&
                        <Col xs={24} md={8} className='h-100'>
                            <SideBar/>
                        </Col>
                    }

                    <Switch>
                        <Route ext path='/chat/:chatId'>
                            <Col xs={24} md={16} className='h-100'>
                                <Chat/>
                            </Col>
                        </Route>
                        <Route>
                            {isDesktop && <Col xs={24} md={16} className='h-100'>
                                <h6 className='text-center mt-page'>Please select chat</h6>
                            
                            </Col>}
                        </Route>
                    </Switch>
                </Row>
            </Grid>
        </RoomsProivder>
    )
}

export default Home;