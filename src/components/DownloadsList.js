import PropTypes from "prop-types";
import React from "react";
import { injectIntl, defineMessages, intlShape, FormattedMessage } from "react-intl";
import { CloseButton } from "./Button.js";
import styled from "styled-components";
import { ModalHeading } from "./Headings";
import colors from "yoast-components/style-guide/colors.json";
import defaults from "../config/defaults.json";
import {
	ListTable,
	ColumnPrimary,
	ColumnFixedWidth,
	makeFullWidth,
	responsiveHeaders,
	RowMobileCollapse,
} from "./Tables";


const messages = defineMessages( {
	installationGuideLink: {
		id: "downloadModal.installationGuideLink",
		defaultMessage: "View the installation guides",
	},
	downloadLink: {
		id: "downloadModal.downloadLink",
		defaultMessage: "Download",
	},
} );

const DownloadLink = styled.a`
	padding-left: 0;
	color: ${ colors.$color_blue };
`;

const InstallationGuideLink = styled.a`
	padding-left: 0;
	color: ${ colors.$color_blue };
	font-size: 14px;
	text-decoration: underline;
	padding-right: 100px;
`;

const DownloadModal = styled.div`
	max-width: 640px;
	margin: auto;
	font-size: 1em;
`;

const FullWidthRow = styled( RowMobileCollapse )`
	margin: 0 -16px;
`;

const ProductNameColumn = styled( ColumnPrimary )`
	padding-right: 50px;

	@media screen and ( max-width: ${ defaults.css.breakpoint.tablet }px ) {
		padding-right: 0;
	}
`;

const DownloadLinkColumn = styled( ColumnFixedWidth )`
	@media screen and ( max-width: ${ defaults.css.breakpoint.mobile }px ) {
		padding-left: 0;
	}
`;

const RightAlignedCloseButton = styled( CloseButton )`
	float: right;
`;

const FooterArea = styled.div`
	padding-right: 8px;
	padding-bottom: 28px;
`;

class DownloadsList extends React.Component {
	/**
	 * Initializes the class with the specified props.
	 *
	 * @param {Object} props The props to be passed to the class that was extended from.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	makeDownloadRow( download ) {
		const ResponsiveProductNameColumn = makeFullWidth( responsiveHeaders( ProductNameColumn ) );

		const id = download.name;
		const productName = download.name;
		const downloadLink = download.file;

		return (
			<FullWidthRow verticalAlign={ "center" } key={ id } hasHeaderLabels={ false }>
				<ResponsiveProductNameColumn>
					<span> { productName } </span>
				</ResponsiveProductNameColumn>
				<DownloadLinkColumn>
					<DownloadLink
						target="_blank"
						href={ downloadLink }
						rel="noopener noreferrer"
					>
						<FormattedMessage { ...messages.downloadLink } />
					</DownloadLink>
				</DownloadLinkColumn>
			</FullWidthRow>
		);
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ReactElement} The rendered component.
	 */
	render() {
		const downloadsTable =
			<ListTable invertZebra={ true } { ...this.props }>
				{ this.props.downloads.map( ( one ) => {
					return this.makeDownloadRow( one );
				} ) }
			</ListTable>;

		return (
			<DownloadModal>
				<ModalHeading>
					<FormattedMessage id="sites.downloadsList.header" defaultMessage="Plugin downloads" />
				</ModalHeading>
				{ downloadsTable }
				<FooterArea>
					<InstallationGuideLink
						target="_blank"
						href="https://yoa.st/myyoast-installation"
						rel="noopener noreferrer"
					>
						{ this.props.intl.formatMessage( messages.installationGuideLink ) }
					</InstallationGuideLink>
					<RightAlignedCloseButton onClick={ this.props.onDownloadModalClose } enabledStyle={ false }>
						<FormattedMessage id="sites.addSite.cancel" defaultMessage="Close" />
					</RightAlignedCloseButton>
				</FooterArea>
			</DownloadModal>
		);
	}
}

DownloadsList.propTypes = {
	onDownloadModalClose: PropTypes.func.isRequired,
	intl: intlShape.isRequired,
	downloads: PropTypes.arrayOf( PropTypes.object ),
};

DownloadsList.defaultProps = {
	downloads: [],
};

export default injectIntl( DownloadsList );
