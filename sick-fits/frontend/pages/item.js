import React, { Component } from 'react';
import SingleItem from '../components/SingleItem'

const Item = props => (
    <div>
        <p>
            <SingleItem id={props.query.id}/>
        </p>
    </div>
)


export default Item;