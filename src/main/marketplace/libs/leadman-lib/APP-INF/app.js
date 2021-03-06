controllerMappings.addComponent("leadman/components", "leadCompanies", "html", "Show list of companies in table format", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadsGeoLocation", "html", "Display leads in a map canvas", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadStatsSummary", "html", "Display stats for a funnel", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadsList", "html", "Display leads list", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadSalesSummary", "html", "Displays sales and tasks summary for Team Leaders / Sales Managers ", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadProfile", "html", "Displays lead profile details and tags (NEW) ", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadCompanyProfile", "html", "Displays lead company details and tags (NEW) ", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadDetailTabs", "html", "Displays lead detail tabs ie Summary, Contact, Company, etc (NEW) ", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadDetailTabContent", "html", "Displays lead profile content which loads via pjax (NEW) ", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadDetailCompanyTabContent", "html", "Displays lead profile content which loads via pjax (NEW) ", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadDetailContactTabContent", "html", "Displays lead profile content which loads via pjax (NEW) ", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadDetailActivities", "html", "Displays lead profile content which loads via pjax (NEW) ", "Leadman App component");

controllerMappings.addComponent("leadman/components", "leadAnalyticsNewLeadsCreated", "html", "Display new leads created", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadAnalyticsLeadsLost", "html", "Display the leads lost", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadAnalyticsLeadsClosed", "html", "Display the leads closed", "Leadman App component");
controllerMappings.addComponent("leadman/components", "countNewQuotes", "html", "Display number of new quotes", "Leadman App component");
controllerMappings.addComponent("leadman/components", "countAcceptedQuotes", "html", "Display number of accepted quotes", "Leadman App component");
controllerMappings.addComponent("leadman/components", "countNewProposals", "html", "Display number of new proposals", "Leadman App component");

controllerMappings.addComponent("leadman/components", "leadsImporterWizard", "html", "Import wizard for leads", "Leadman App component");

/* Templates */
controllerMappings.addTemplate('theme/apps/leadman/', 
                               'viewProfile', 
                               'View Customer Profile', 
                               true);
                               
// ============================================================================
// Portlet
// ============================================================================
controllerMappings
    .websitePortletController()
    .portletSection('shoppingCart')
    .templatePath('/theme/apps/leadman/leadmanOrgSelectorPortlet.html')
    .method('getLeadmanOrgSelector')
    .enabled(true)
    .build();

function getLeadmanOrgSelector() {
    log.info('getLeadmanOrgSelector');
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    if (text){
        return text.replace(urlRegex, function(url) {
            return '<a target="_blank" href="' + url + '">' + url + '</a>';
        })
    } else {
        return '';
    }
}

controllerMappings
    .websiteController()
    .enabled(true)
    .isPublic(false)
    .path('/leadSendEmail')
    .addMethod('POST', 'leadDetailSendEmail')
    .postPriviledge("READ_CONTENT")
    .build();

function leadDetailSendEmail(page, params) {
    var toAddress = params.toAddress;
    var fromAddress = params.fromAddress;
    var subject = params.subject;
    var message = params.message;
    log.info('leadDetailSendEmail toAddress={} fromAddress={} subject={} message={}', toAddress, fromAddress, subject, message);
    if (!toAddress){
        return views.jsonObjectView({status: false, messages: ["Please enter email to send"]});
    }

    applications.email.emailBuilder()
        .recipientAddress(toAddress)
        .fromAddress(fromAddress)
        .subject(subject)
        .text(message)
        .build();

    return views.jsonObjectView({status: true});
}


