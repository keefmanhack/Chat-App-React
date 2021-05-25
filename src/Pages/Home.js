import React from 'react'
import { Grid, Row, Col } from 'rsuite';
import SideBar from '../Components/SideBar';

const Home = () => {
    console.log();
    return (
        <Grid fluid className='h-100'>
            <Row>
                <Col xs={24} md={8}>
                    <SideBar/>
                </Col>
            </Row>
        </Grid>
    )
}

export default Home;