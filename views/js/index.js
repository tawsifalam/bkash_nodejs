$(document).ready(function () {
  $.ajax({
    url: "/bkashToken",
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("got data from token  .>>>>>>>>", data);
    },
    error: function () {
      console.log("error");
    },
  });

  var paymentRequest = { amount: "105", intent: "sale" };

  bKash.init({
    paymentMode: "checkout",
    paymentRequest: paymentRequest,
    createRequest: function () {
      $.ajax({
        url: "/creatBkashPayment",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
          console.log("create payment data >>>>>", data);
          if (data && data.paymentID != null) {
            paymentID = data.paymentID;
            bKash.create().onSuccess(data);
          } else {
            console.log("error");
            bKash.create().onError();
          }
        },
        error: function () {
          console.log("error");
          bKash.create().onError();
        },
      });
    },
    executeRequestOnAuthorization: function () {
      $.ajax({
        url: "/executeBkashPayment",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
          console.log("execute payment data >>>>>", data);
          if (data && data.paymentID != null) {
            alert("[SUCCESS] data : " + JSON.stringify(data));
          } else {
            bKash.execute().onError();
          }
        },
        error: function () {
          bKash.execute().onError();
        },
      });
    },
    onClose: function (e) {
      console.log("closed >>>>>>>>", e);
    },
  });
});

function callReconfigure(val) {
  bKash.reconfigure(val);
}

function clickPayButton() {
  $("#bKash_button").trigger("click");
}
