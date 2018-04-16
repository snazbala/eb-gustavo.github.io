function showWidget(eventId, modal, affiliateCode) {
    var options = {
        widgetType: 'checkout',
        eventId: eventId,
        onOrderComplete: function() {
            console.log('Order Completed');
        },
        googleAnalyticsClientId: '1234567',
    };

    if (affiliateCode) {
        options['affiliateCode'] = affiliateCode;
    }

    if (modal === 'on') {
        options['modal'] = true;
        options['modalTriggerElementId'] = 'modal-trigger';
    } else {
        options['iframeContainerId'] = 'checkout-widget';
    }

    EBWidgets.createWidget(options);
}

function buildWidgetContainer(eventId, modal, affiliateCode) {
    if (modal === 'on') {
        var checkoutWidget = document.getElementById('button-container')
        var button = document.createElement('button');
        var buttonLabel = document.createTextNode('Launch Modal ()');

        button.id = 'modal-trigger';
        button.type = 'button';
        button.appendChild(buttonLabel);
        checkoutWidget.appendChild(button);
        button.className = 'btn primary w-button';
    }

    showWidget(eventId, modal, affiliateCode);
}

function decode(value, replaceRegex) {
    return decodeURIComponent(value.replace(replaceRegex, " "));
};

function parseUrlParams() {
    var replaceRegex = /\+/g;
    var searchRegex = /([^&=]+)=?([^&]*)/g;
    var query = window.location.search.substring(1);
    var match;
    var urlParams = {};

    while (match = searchRegex.exec(query)) {
        urlParams[decode(match[1], replaceRegex)] = decode(match[2], replaceRegex);
    }
    return urlParams;
}

function downloadWidgetJs(urlParams) {
    var scriptElement = document.createElement('script');
    var widgetUrlMap = {
        dev: 'https://www.evbdev.com/static/widgets/eb_widgets.js',
        qa: 'https://www.evbqa.com/static/widgets/eb_widgets.js',
        prod: 'https://www.eventbrite.com/static/widgets/eb_widgets.js'
    };

    scriptElement.type = 'text/javascript';
    scriptElement.src = widgetUrlMap[urlParams.env];
    scriptElement.addEventListener('load', buildWidgetContainer.bind(null, urlParams.eid, urlParams.modal, urlParams.affiliateCode))
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
}

function fillForm(urlParams) {
    document.getElementsByName('env')[0].value = urlParams.env;
    document.getElementsByName('eid')[0].value = urlParams.eid;
    document.getElementsByName('modal')[0].checked = urlParams.modal === 'on';
    document.getElementsByName('affiliateCode')[0].value = urlParams.affiliateCode;
}

function initApp() {
    var urlParams = parseUrlParams();

    if (!Object.keys(urlParams).length) {
        return;
    }

    fillForm(urlParams);
    downloadWidgetJs(urlParams);
}

if (window.addEventListener) {
    window.addEventListener('load', initApp, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', initApp);
} else {
    window.onload = initApp;
}
