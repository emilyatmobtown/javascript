import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import defaults from "../config/defaults.json";

const ItemsContainer = styled.ul`
	padding: 0;
	list-style: none;
	flex-shrink: 0;
	align-items: flex-start;
	
		@media screen and ( max-width: ${ defaults.css.breakpoint.mobile }px ) {
		overflow:hidden;
	}
`;

const Item = styled.li``;

/**
 * LineItems.
 *
 * @param {Object} props Properties to be passed to the table.
 * @returns {ReactElement} A row of LineItems.
 */
function LineItems( props ) {
	const items = props.items.map( ( item ) => {
		return <Item key={ item.id }>{ item.quantity }x { item.productName }</Item>;
	} );
	return <ItemsContainer>{ items }</ItemsContainer>;
}

LineItems.propTypes = {
	items: PropTypes.array,
};

LineItems.defaultProps = {
	items: "",
};

export default LineItems;
