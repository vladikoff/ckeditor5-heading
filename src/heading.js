/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import HeadingEngine from './headingengine.js';

import Feature from '../core/feature.js';

import Model from '../ui/model.js';
import ListDropdownController from '../ui/dropdown/list/listdropdown.js';
import ListDropdownView from '../ui/dropdown/list/listdropdownview.js';

import Collection from '../utils/collection.js';

/**
 * The headings feature. It introduces the `'headings'` drop-down list and the `'heading'` command which allow
 * to convert paragraphs into headings.
 *
 * @memberOf heading
 * @extends core.Feature
 */
export default class Heading extends Feature {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ HeadingEngine ];
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const command = editor.commands.get( 'heading' );
		const formats = command.formats;
		const collection = new Collection();

		// Add formats to collection.
		for ( let format of formats ) {
			collection.add( new Model( {
				id: format.id,
				label: format.label
			} ) );
		}

		// Create dropdown model.
		const dropdownModel = new Model( {
			isEnabled: true,
			isOn: false,
			label: 'Heading',
			withText: true,

			// Create item list model.
			content: new Model( {
				items: collection
			} )
		} );

		// Bind dropdown model to command.
		dropdownModel.bind( 'isEnabled' ).to( command, 'isEnabled' );
		dropdownModel.bind( 'label' ).to( command, 'value', format => format.label );

		// Execute command when an item from the dropdown is selected.
		this.listenTo( dropdownModel, 'execute', ( evt ) => {
			editor.execute( 'heading', evt.source.id );
			editor.editing.view.focus();
		} );

		// Register UI component.
		editor.ui.featureComponents.add( 'headings', ListDropdownController, ListDropdownView, dropdownModel );
	}
}