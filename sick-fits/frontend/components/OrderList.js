import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import styled from 'styled-components'
import gql from 'graphql-tag'
import formatMoney from '../lib/formatMoney'
import OrderItemStyles from './styles/OrderItemStyles'
import { CURRENT_USER_QUERY } from './User'

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
        id
        charge
        total
        createdAt
        items {
            id
            title
            description
            price
            image
            quantity
        }
    }
  }
`;

const OrderUl = styled.ul`
    display: grid;
    grid-gap: 4rem;
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`

class OrderList extends Component {
    render() {
        return (
            <Query query={USER_ORDERS_QUERY} refetchQuery={[{ query: USER_ORDERS_QUERY }]}>
                {({ data: { orders } }) => {
                    return (
                        <div>
                            <h2>You have {orders.length} orders</h2>
                            <OrderUl>
                                {orders.map(order => (
                                    <OrderItemStyles key={order.id}>
                                        <Link href={{
                                            pathname: '/order',
                                            query: { id: order.id }
                                        }}>
                                            <a>
                                                <div className="order-meta">
                                                    <p>{order.items.reduce((a,b) => a + b.quantity, 0)} Item{(order.items.reduce((a,b) => a + b.quantity, 0)) === 1 ? "" : "s"}</p>
                                                    <p>{order.items.length}</p>
                                                    <p>{formatDistance(order.createdAt, new Date())}</p>
                                                    <p>{formatMoney(order.total)}</p>
                                                </div>
                                                <div className="images">
                                                    {order.items.map(item => (
                                                        <img src={item.image} key={item.id} alt={item.title} />
                                                    ))}
                                                </div>
                                            </a>
                                        </Link>
                                    </OrderItemStyles>
                                ))}
                            </OrderUl>
                        </div>
                    )}}
            </Query>
        );
    }
}

export default OrderList;