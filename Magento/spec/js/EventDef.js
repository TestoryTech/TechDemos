const EXCLUDE_LOW_LEVEL = java.lang.System.getProperty("EXCLUDE_LOW_LEVEL");

// Define the events that we want to use in our test. Needed only for auto-completion.
function login({ user }) { }
function adminLogin({ user }) { }
function addToCart({ product, user }) { }
function checkOut({ shippingMethod, user }) { }
function addProduct({ product }) { }
function changeProductPrice({ product }) { }


// If we are running in exclude-low-level mode, we define empty events.
if (EXCLUDE_LOW_LEVEL == "true") {
    defineEvent(SeleniumSession, "Login", function (session, event) { });
    defineEvent(SeleniumSession, "AdminLogin", function (session, event) { });
    defineEvent(SeleniumSession, "AddToCart", function (session, event) { });
    defineEvent(SeleniumSession, "CheckOut", function (session, event) { });
    defineEvent(SeleniumSession, "AddProduct", function (session, event) { });
    defineEvent(SeleniumSession, "AddProductToCart", function (session, event) { });
    defineEvent(SeleniumSession, "ChangeProductPrice", function (session, event) { });

    // If we are not running in exclude-low-level mode, we define Selenium content in the events.    
} else {
    /***********************************************************************************
     * Login to the store as a regular user.
     *
     * Parameters:
     *   username: string - The user that logs in
     *   password: string - The password of that user
     ************************************************************************************/
    defineEvent(SeleniumSession, "Login", function (session, event) {
        with (session) {
            click("//button[contains(@class,'accountTrigger-trigger-23q clickable-root-1HB')]");
            waitForVisibility("//span[contains(@class,'signIn-title-2hm capitalize')]", 1000);
            writeText('//input[@id="email"]', event.username);
            writeText("css::input#Password", event.password);
            click("xpath:://span[text()='Sign-in to Your Account']/following::span[text()='Sign In']");

            if (event.expectedWelcome)
                waitForVisibility("(//span[text()='" + event.expectedWelcome + "'])[2]", 10000)
        }
    });



    /***********************************************************************************
     * Login to the store as an admin user.
     *
     * Parameters:
     *   username: string - The user that logs in
     *   password: string - The password of that user
     ************************************************************************************/
    defineEvent(SeleniumSession, "AdminLogin", function (session, event) {
        with (session) {
            // bp.log.info("AdminLogin "+event.user.username+" "+event.user.password)
            writeText('//input[@id="username"]', event.user.username);
            writeText('//input[@id="login"]', event.user.password);
            click('//button[@class="action-login action-primary"]');
        }
    });

    /***********************************************************************************/
    defineEvent(SeleniumSession, "AddProduct", function (session, event) {
        with (session) {

            waitForClickability('//li[contains(@class,"item-catalog")]', 3000);
            click('//li[contains(@class,"item-catalog")]');
            waitForClickability('//li[contains(@class,"item-catalog-products")]', 3000);
            click('//li[contains(@class,"item-catalog-products")]');
            waitForClickability('//button[@id="add_new_product-button"]', 3000);
            click('//button[@id="add_new_product-button"]');

            waitForVisibility('//input[@name="product[name]"]', 10000);
            clear('//input[@name="product[name]"]');
            writeText('//input[@name="product[name]"]', event.product.name);
            clear('//input[@name="product[sku]"]');
            writeText('//input[@name="product[sku]"]', event.product.sku);
            clear('//input[@name="product[quantity_and_stock_status][qty]"]');
            writeText('//input[@name="product[quantity_and_stock_status][qty]"]', event.product.qty);
            clear('//input[@name="product[price]"]');
            writeText('//input[@name="product[price]"]', event.product.price);

            click('//div[text()="Select..."]');

            clear('//div[@class="action-menu _active"]/div[@class="admin__action-multiselect-search-wrap"]/input[@class="admin__control-text admin__action-multiselect-search"]')
            writeText('//div[@class="action-menu _active"]/div[@class="admin__action-multiselect-search-wrap"]/input[@class="admin__control-text admin__action-multiselect-search"]', "Tees");

            click('//label[@class="admin__action-multiselect-label"]/span[text()="Default Category / Men / Tops"]');

            click('//button[@class="action-default"]');

            click('//button[@id="save-button"]');

            // waitForClickability('//a[@title="My Account"]', 14000);
            // click('//a[@title="My Account"]');
            // click('//a[@title="Sign Out"]');
        }
    });
    /***********************************************************************************/
    defineEvent(SeleniumSession, "ChangeProductPrice", function (session, event) {
        with (session) {

            waitForClickability('//li[contains(@class,"item-catalog")]', 5000);
            click('//li[contains(@class,"item-catalog")]');
            waitForClickability('//li[contains(@class,"item-catalog-products")]', 5000);
            click('//li[contains(@class,"item-catalog-products")]');

            productName = event.product.product + '-' + event.product.options[0] + '-' + event.product.options[1];
            bp.log.info("ProductName " + productName)

            waitForVisibility('//input[@class="admin__control-text data-grid-search-control"]', 3000);
            clear('//input[@class="admin__control-text data-grid-search-control"]')
            writeText('//input[@class="admin__control-text data-grid-search-control"]', productName);
            waitForClickability('//button[@data-bind="click: apply.bind($data, false)"]', 1000);
            // data-bind="i18n: 'Search'"
            click('//button[@data-bind="click: apply.bind($data, false)"]');
            click('//a[@class="action-menu-item"]');

            waitForVisibility('//input[@name="product[price]"]', 3000);
            clear('//input[@name="product[price]"]')
            writeText('//input[@name="product[price]"]', event.product.newPrice);

            click('//button[@id="save-button"]');

            // waitForClickability('//a[@title="My Account"]', 14000);
            // click('//a[@title="My Account"]');
            // click('//a[@title="Sign Out"]');
        }
    });

    /***********************************************************************************
     * Logout a regular user.
     *
     ************************************************************************************/
    defineEvent(SeleniumSession, "Logout", function (session, event) {
        with (session) {
            click("//span[@class='customer-name']//button");
            click("//a[normalize-space()='Sign Out']");
        }
    });

    /***********************************************************************************
     * Register a  user.
     *
     * Parameters:
     *   s: string              - The name of the session in which we want this event to take place
     *   firsntame : string     - The name of the new user
     *   lastname : string      - The surname of the new user
     *   email_address : string - An email address for the user. Must be unique.
     *   password : string      - Password for the new user.
     ************************************************************************************/
    defineEvent(SeleniumSession, "Register", function (session, event) {
        with (session) {
            click("//a[@href='http://localhost/customer/account/create/']");
            writeText('//input[@id="firstname"]', event.firstname);
            writeText('//input[@id="lastname"]', event.lastname);
            writeText('//input[@id="email_address"]', event.email_address);
            writeText('//input[@id="password"]', event.password);
            writeText('//input[@id="password-confirmation"]', event.password);
            click('//button[@type="submit" and contains(concat(" ",normalize-space(@class)," ")," action ") and contains(concat(" ",normalize-space(@class)," ")," submit ")]');
            assertText("//div[@data-ui-id='message-success']//div[1]", "Thank you for registering with Main Website Store.")
        }
    });


    /***********************************************************************************
     * Add an item to the cart of the currently logged-in user.
     *
     * Parameters:
     *   s: string                  - The name of the session in which we want this event to take place.
     *   category : string          - The category of the product that we want to add.
     *   subCategory : string       - The sub-category of the product that we want to add.
     *   product : string           - The  product that we want to add.
     *   options : array of strings - A list of options for the product.
     *   quantity: number, optional - The number of items to add.
     ************************************************************************************/
    defineEvent(SeleniumSession, "AddToCart", function (session, event) {
        with (session) {
            // Click the menu accordion button
            click("//div[@id='root']/main[1]/header[1]/div[1]/div[1]/button[1]")

            // Click the category
            click("//span[text()='" + event.product.category + "']");

            // Click the sub-category
            click("//span[text()='" + event.product.subCategory + "']");

            // Click the product
            click("//span[text() = '" + event.product.product + "']");

            // Click the options
            for (let opt in event.product.options) {
                // Click the option
                click("//button[@title='" + event.product.options[opt] + "']");

                // Verify that it was selected
                waitForVisibility("//button[@title='" + event.product.options[opt] + "' and contains(@class,'selected')]", 5000);
            }
            // Write the quantity
            if (event.product.quantity) {
                writeText("//input[@name='quantity']", event.product.quantity, true);
            }

            // if (event.product.expected_image) {
            //     waitForVisibility("//img[contains(@loading='lazy' and @src, '" + event.product.expected_image + "')]", 5000);
            // }

            // Click the add to cart button
            click("//span[text()='Add to Cart']");

            // waitForVisibility("//div[@data-ui-id='message-success']//div[1]", 5000);
            // assertText("//div[@data-ui-id='message-success']//div[1]", "You added " + event.product.product + " to your shopping cart.");

            // Click the menu accordion button
            click("//div[@id='root']/main[1]/header[1]/div[1]/div[1]/button[1]")

            // Go to main menu by clicking the <- button
            click("xpath:://span[text()='Main Menu']/preceding::button");

            // Exit the menu by clickin thx X button
            click("xpath:://span[text()='Main Menu']/preceding::button");
        }
    })

    defineEvent(SeleniumSession, "CheckPrice", function (session, event) {
        with (session) {

            refresh();
            click("//span[text()='" + event.product.category + "']");
            click("(//span[text()='" + event.product.category + "'])/following::span[text()='" + event.product.subCategory + "']/following::a[text()[normalize-space()='" + event.product.subSubCategory + "']]");

            selectByValue("xpath:://div[@class='toolbar toolbar-products']/following::select[@id='limiter']", '36')

            scrollToElement("(//img[@alt='" + event.product.product + "'])[last()]")
            waitForClickability("(//img[@alt='" + event.product.product + "'])[last()]", 1000);
            click("(//img[@alt='" + event.product.product + "'])[last()]");

            for (let opt in event.product.options) {
                // Click the options
                click("//div[@data-option-label='" + event.product.options[opt] + "']");

                // Verify that it was selected
                waitForVisibility("//div[@data-option-label='" + event.product.options[opt] + "' and contains(@class,'selected')]", 5000);
            }

            waitForVisibility("//span[@class=\"price-wrapper \"]", 5000);
            assertText("//span[@data-price-amount][1]", event.product.price);
        }
    })

    /***********************************************************************************
     * Remove an item from the cart of the currently logged-in user.
     *
     * Parameters:
     *   s: string        - The name of the session in which we want this event to take place.
     *   product : string - The  product that we want to remove.
     ************************************************************************************/
    defineEvent(SeleniumSession, "RemoveFromCart", function (session, event) {
        with (session) {
            // Show the cart
            runCode(`document.querySelectorAll('button[class*="cartTrigger"]')[0].click()`);

            // Click the remove button
            click("xpath:://div[contains(@class,'productList-root-2dL gap-sm')]//div/following::a[contains(text(),'" + event.product.product + "')]/following::button[@class='item-deleteButton-2dW']")

            // Hide the cart
            runCode(`document.querySelectorAll('button[class*="cartTrigger"]')[0].click()`);
        }
    });

    /***********************************************************************************
     * Check that a product exists in the cart of the currently logged-in user.
     *
     * Parameters:
     *   s: string -      - The name of the session in which we want this event to take place.
     *   product : string - The  product that we want to remove.
     ************************************************************************************/
    defineEvent(SeleniumSession, "CheckExistenceOfProductInCart", function (session, event) {
        with (session) {
            click("//a[@class='action showcart']");
            waitForVisibility("//div[contains(@class,'block block-minicart')]//img[@alt='" + event.product + "']", 5000);
            click("//button[@id='btn-minicart-close']");
        }
    });


    /***********************************************************************************
     * Check-out the items in the cart of the currently logged-in user.
     *
     * Parameters:
     *   s: string                                              - The name of the session in which we want this event to take place.
     *   verifyItems : array of strings, optional               - A list of items that we expect to see in the cart.
     *   verifyNonexistenceOfItems : array of strings, optional - A list of items that we expect not to see in the cart.
     *   shippingMethod : string, optional                      - The shopping method that we want to use for this order.
     *   cardHolderName : string, optional                      - The name of the card holder.
     *   cardNumber : string, optional                          - The card number.
     *   expirationDate : string, optional                      - The expiration date of the card.
     *   cvv : string, optional                                 - The CVV of the card.
     * 
     ************************************************************************************/
    defineEvent(SeleniumSession, "CheckOut", function (session, event) {
        with (session) {
            // Show the cart
            runCode(`document.querySelectorAll('button[class*="cartTrigger"]')[0].click()`);

            // Click the checkout button
            sleep(1000)
            click("//span[text()='CHECKOUT']");

            // Wait for the checkout page to load
            waitForVisibility("//*[text()='Credit Card']", 20000);

            // Click the credit card button
            click('//*[@id="paymentMethod--braintree"]');

            // Type the card holder name
            switchFrame("//iframe[@id='braintree-hosted-field-cardholderName']");
            writeText("//input[@id='cardholder-name']", event.user.cardHolderName);
            switchFrame("Main Frame")

            // Type the card number
            switchFrame("//iframe[contains(@id,'braintree-hosted-field-number')]");
            writeText("//input", event.user.cardNumber);
            switchFrame("Main Frame")

            // Type the expiration date
            switchFrame("//iframe[@id='braintree-hosted-field-expirationDate']");
            writeText("//input[@id='expiration']", event.user.expirationDate);
            switchFrame("Main Frame")

            // Type the CVV
            switchFrame("//iframe[@id='braintree-hosted-field-cvv']");
            writeText("//input[@id='cvv']", event.user.cvv);
            switchFrame("Main Frame")

            click("//span[text()='Review Order']");

            // Verify that items are in the cart
            if (event.verifyItems) {
                for (item of event.verifyItems) {
                    waitForVisibility("//img[@alt='" + item.product + "']", 5000);
                }
            }

            // Verify that items are not in the cart
            if (event.verifyNonexistenceOfItems) {
                for (item of event.verifyNonexistenceOfItems) {
                    checkNonExistance("//img[@alt='" + item.product + "']", 500);
                }
            }

            // Place the order and wait for the confirmation
            click("//span[text()='Place Order']");
            waitForVisibility("//*[contains(text(),'Thank you for your order!')]", 9000);
        }
    });
}