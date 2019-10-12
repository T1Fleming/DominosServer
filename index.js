let pizzapi = require('dominos'); // or without payment option use require('pizzapi');
// let pizzapi = require('pizzapi');
const util = require('util')
let myStore = new pizzapi.Store({});
const storeId = ''
myStore.ID = storeId;
const cc = require('./cc')

const addressParams = {
    Street: "",
    City: "",
    Region: "",
    PostalCode: "",
    Type: ""
};

const ericAddressObj = new pizzapi.Address(addressParams);

const orderForEric = new pizzapi.Customer({
    firstName: '',
    lastName: '',
    address: ericAddressObj,
    email: '',
    phone: '',
})

let order;
let newOrder;

// Buffalo wings
// Cheesy bread
// Lava Cake

const http = require('http');

function createOrder(customer) {
    order = new pizzapi.Order(
        {
            customer: customer,
            storeID: '', //optional set the store ID right away
            deliveryMethod: 'Delivery' //(or 'Carryout')
        }
    );
    return 'order created'
}

function addToOrder() {
    order.addItem(
        new pizzapi.Item(
            {
                code: 'B8PCSCB',
                // code: 'TOTALLYFAKE',
                options: '',
                quantity: 1
            }
        )
    );
    order.addItem(
        new pizzapi.Item(
            {
                code: 'W08PHOTW',
                // code: 'TOTALLYFAKE',
                options: '',
                quantity: 1
            }
        )
    );
    return 'item added'
}

function findPizzaPlaces() {
    return new Promise((resolve, reject) => {
        pizzapi.Util.findNearbyStores(
            'ADDRESS',
            'Delivery',
            function (storeData) {
                resolve(storeData.result.Stores[0])
            }
        );
    })
}

function getMenu() {
    return new Promise((resolve, reject) => {
        myStore.getFriendlyNames(
            function (storeData) {
                resolve(storeData);
            }
        );
        // myStore.getMenu(
        //     function (storeData) {
        //         resolve(storeData.menuByCode.F_PARMT.menuData);
        //     }
        // );
    })
}

function addPayment() {
    let cardInfo = new order.PaymentObject();
    //console.log(order)
    cardInfo = { ...cardInfo, ...cc }
    // cardInfo.Type = 'GiftCard'
    cardInfo.Amount = newOrder.Amounts.Customer;
    cardInfo.CardType = newOrder.validateCC(cc.Number);
    newOrder.Payments.push(cardInfo);
    console.log('Adding payments...')
    // console.log(order.Amounts)
    //console.log(order)
}

//create a server object:
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' }); // http header
    var url = req.url;
    if (url === '/getpizza') {
        res.write('<h1>Pizza Places!<h1>'); //write a response
        findPizzaPlaces().then((data) => {
            console.log(data)
            res.end();
        })
        //end the response

    } else if (url === '/addpayment') {
        addPayment()
        res.write('<h1>Payment added</h1>')
        res.end()
    } else if (url === '/getmenu') {
        res.write('<h1>Menu<h1>'); //write a response
        getMenu().then((data) => {
            console.log(util.inspect(data.result, { 'maxArrayLength': null }))
            res.end(); //end the response
        })

    } else if (url === '/addorder') {
        addToOrder()
        res.write('<h1>Added Order!<h1>');
        console.log('added order')
        console.log(order)
        res.end()
    } else if (url === '/createorder') {
        createOrder(orderForEric)
        console.log('created')
        res.write('<h1>Order Made!<h1>');
        res.end()

    } else if (url === '/getprice') {
        res.write('<h1>getting price...<h1>')
        order.price(
            function (result) {
                console.log(result.result.Order)
                res.end()
                console.log('AND')
                console.log(order)
            }
        );
    } else if (url === '/verify') {

        // Validate
        order.validate(
            function (result) {
                newOrder = new pizzapi.Order(result.result);

                // Get Price
                newOrder.price(function (result) {
                    // var priceResults = result.result.Order;

                    // Add Payment
                    addPayment()
                    console.log('=====FINAL ORDER=======')
                    console.log(newOrder)
                    res.end()

                    // order.place(function(result){
                    // console.log('+===== ORDER PLACED =====+')
                    // console.log(result.result.Order)
                    // })
                })


                // console.log(result)
                // console.log(Object.keys(result.result))
                // console.log(result.result.Order.Amounts)

            }
        );

    } else {
        res.write('<h1>Hello World!<h1>'); //write a response
        res.end(); //end the response
    }

    console.log('=================')
}).listen(3000, function () {
    console.log("server start at port 3000"); //the server object listens on port 3000
});

