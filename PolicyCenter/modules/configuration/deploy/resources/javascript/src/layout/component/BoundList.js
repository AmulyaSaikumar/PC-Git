/*
This file is part of Ext JS 4.2

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial
Software License Agreement provided with the Software or, alternatively, in accordance with the
terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-09-18 17:18:59 (940c324ac822b840618a3a8b2b4b873f83a1a9b1)
*/
/**
 * Component layout for {@link Ext.view.BoundList}.
 * @private
 */
Ext.define('Ext.layout.component.BoundList', {
    extend: 'Ext.layout.component.Auto',
    alias: 'layout.boundlist',

    type: 'component',
    
    beginLayout: function(ownerContext) {
        var me = this,
            owner = me.owner,
            toolbar = owner.pagingToolbar;

        me.callParent(arguments);
        
        if (owner.floating) {
            ownerContext.savedXY = owner.getXY();
            // move way offscreen to prevent any constraining
            // only move on the y axis to avoid triggering a horizontal scrollbar in rtl mode
            owner.setXY([0, -9999]);
        }
        
        if (toolbar) {
            ownerContext.toolbarContext = ownerContext.context.getCmp(toolbar);
        }
        ownerContext.listContext = ownerContext.getEl('listEl');
    },
    
    beginLayoutCycle: function(ownerContext){
        var owner = this.owner;
        
        this.callParent(arguments);
        if (ownerContext.heightModel.auto) {
            // Set the el/listEl to be autoHeight since they may have been previously sized
            // by another layout process. If the el was at maxHeight first, the listEl will
            // always size to the maxHeight regardless of the content.
            owner.el.setHeight('auto');
            owner.listEl.setHeight('auto');
        }
    },

    getLayoutItems: function() {
        var toolbar = this.owner.pagingToolbar;
        return toolbar ? [toolbar] : [];
    },
    
    isValidParent: function() {
        // this only ever gets called with the toolbar, since it's rendered inside we
        // know the parent is always valid
        return true;
    },

    finishedLayout: function(ownerContext) {
        var xy = ownerContext.savedXY;
        
        this.callParent(arguments);
        if (xy) {
            this.owner.setXY(xy);
        }
    },
    
    measureContentWidth: function(ownerContext) {
        return this.owner.listEl.getWidth();
    },
    
    measureContentHeight: function(ownerContext) {
        return this.owner.listEl.getHeight();
    },
    
    publishInnerHeight: function(ownerContext, height) {
        var toolbar = ownerContext.toolbarContext,
            toolbarHeight = 0;
            
        if (toolbar) {
            toolbarHeight = toolbar.getProp('height');
        }
        
        if (toolbarHeight === undefined) {
            this.done = false;
        } else {
            ownerContext.listContext.setHeight(height - ownerContext.getFrameInfo().height - toolbarHeight);
        }
    },
    
    calculateOwnerHeightFromContentHeight: function(ownerContext){
        var height = this.callParent(arguments),
            toolbar = ownerContext.toolbarContext;
            
        if (toolbar) {
            height += toolbar.getProp('height');
        }
        return height;
    }
});