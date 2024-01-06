var current_fs, next_fs, previous_fs; 
var left, opacity, scale; 
var animating; 
var currentHost = window.location.origin;
var orderList = [];

$(".next").click(function(){
    if(animating || !$("input[name='restaurant']:checked").val()) {
        alert("Please select restaurant!")
        return false;
    }
    animating = true;
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    next_fs.show();
    current_fs.animate({ opacity: 0 }, {
        step: function(now, mx) {
            scale = 1 - (1 - now) * 0.2;
            left = (now * 50) + "%";
            opacity = 1 - now;
            current_fs.css({
                'transform': 'scale(' + scale + ')',
                'position': 'absolute'
            });
            next_fs.css({ 'left': left, 'opacity': opacity });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        easing: 'easeInOutBack'
    });
    
});


$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	previous_fs.show(); 
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			scale = 0.8 + (1 - now) * 0.2;
			left = ((1-now) * 50)+"%";
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		easing: 'easeInOutBack'
	});
});

$(".submit").click(function(){
	return false;
})

$("#next1").click(function() {
    var selectedRestaurantId = $("input[name='restaurant']:checked").val();
    $("#selectedRestaurantId").val(selectedRestaurantId);
    console.log(selectedRestaurantId)
});

$("#next2").click(function() {
    var selectedChosenDate = $("input[name='chosen_date']").val();
    var selectedStartTime = $("input[name='start_time']").val();
    var selectedEndTime = $("input[name='end_time']").val();
    var selectedRestaurant = $("input[name='restaurant']:checked").val();
    
    var parts = selectedRestaurant.split("-");
    var selectedRestaurantId = Number(parts[1])
    var selectedRestaurantCity = Number(parts[0])
    $("#selectedRestaurantId").val(selectedRestaurantId);
    $("#selectedChosenDate").val(selectedChosenDate);
    $("#selectedStartTime").val(selectedStartTime);
    $("#selectedEndTime").val(selectedEndTime);
   
    if (selectedChosenDate && selectedStartTime && selectedEndTime){
    $.ajax({
        url: currentHost+ "/tables/" + Number(selectedRestaurantId) + "/" + selectedChosenDate + '/' + selectedStartTime + "/" + selectedEndTime + "/",
        type: "GET",
        success: function(data) {
            updateTableList(data.available_tables);
        }
    });
    }
    getResult(selectedRestaurantCity)
});

function updateTableList(data) {
    var tableListContainer = $("#tablelist");
    console.log(tableListContainer)
    console.log(data)

    tableListContainer.empty();
    console.log(data.length)
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var tableInfo = data[i];
            var tableHtml = `<div class="table-option col-sm-6 col-md-4 col-lg-3 mb-1">
                            <label for="table${tableInfo.id}" class="table-label">
                                <div class="row">
                                    <div class="col-6"> 
                                        <img src="${currentHost}/${tableInfo.image}" alt="${tableInfo.id}" class="table-image">
                                    </div>
                                    <div class="table-info col-6">
                                        <div class="table-name">Table ${tableInfo.table_number}</div>
                                        <div class="table-capacity">Capacity: ${tableInfo.capacity}</div>
                                    </div>
                                </div>
                                <input type="radio" name="chosen_table" id="table${tableInfo.id}" class="form-check-input mt-2 table-input" value="${tableInfo.id}" required>
                            </label>
                        </div>`

            tableListContainer.append(tableHtml);
        }
    } else {
        tableListContainer.html("<p>No available tables for the selected date and time.</p>");
    }

    
}
$("#next3").click(function() {
    var chosenTableId = $("input[name='chosen_table']:checked").val();
    $("#selectedChosenTableId").val(chosenTableId);

    console.log(chosenTableId)

    
});
$("#complete").click(function() {
    var chosenTableId = $("input[name='chosen_table']:checked").val();
    var selectedChosenDate = $("input[name='chosen_date']").val();
    var selectedStartTime = $("input[name='start_time']").val();
    var selectedEndTime = $("input[name='end_time']").val();
    var user_id = $("#user_id").text();

    var data = {
        'date': selectedChosenDate,
        'start_time': selectedStartTime,
        'end_time': selectedEndTime,
        'table': chosenTableId,
        'user': Number(user_id)
    };

    if (chosenTableId && selectedChosenDate && selectedStartTime && selectedEndTime && user_id){
        fetch(currentHost + '/api/reservations/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')  
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        for (let index = 0; index < orderList.length; index++) {
            var data2 = {
                "count": orderList[index].count,
                "menu_item": orderList[index].id,
                "user": Number(user_id),
                "reservation": null
            };
            fetch(currentHost + '/api/order-items/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')  
                },
                body: JSON.stringify(data2)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });    
        }
        location.reload()
    }else{
        $("#myToast2").toast("show");

    }
    
    
});
$(document).ready(function () {
    var menuItems;

    $.ajax({
        url: currentHost+'/all_menu_items/', 
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            menuItems = data;
            console.log(menuItems); 
        },
        error: function (error) {
            console.error('AJAX hatası:', error);
        }
    });

    $(document).on("click", ".add-to-order", function () {
        var menuId = $(this).data("menu-id");

        var existingItem = orderList.find(item => item.id === menuId);

        if (existingItem) {
            existingItem.count++;
        } else {
            orderList.push({ id: menuId, count: 1 });
        }

        console.log(orderList);

        updateSelectedOrders();
    });

    $(document).on("click", ".increase-count", function () {
        var menuId = $(this).data("menu-id");

        var existingItem = orderList.find(item => item.id === menuId);

        if (existingItem) {
            existingItem.count++;

            console.log(orderList);

            updateSelectedOrders();
        }
    });

    $(document).on("click", ".decrease-count", function () {
        var menuId = $(this).data("menu-id");

        var existingItem = orderList.find(item => item.id === menuId);

        if (existingItem) {
            if (existingItem.count > 1) {
                existingItem.count--;
            } else {
                orderList = orderList.filter(item => item.id !== menuId);
            }

            console.log(orderList);

            updateSelectedOrders();
        }
    });

    $("#place-order-btn").on("click", function () {
        console.log("Final Order List:", orderList);

    });

    function updateSelectedOrders() {
        var selectedOrdersList = $("#selected-orders-list");

        selectedOrdersList.empty();

        orderList.forEach(function (order) {
            var menuItem = getMenuById(order.id);

            var listItem = $("<div class='list-group-item'></div>");

            var orderDetails = $("<div class='d-flex justify-content-between align-items-center'></div>");

            var orderImage = $("<img src='" + currentHost + '/' + menuItem.image + "' class='rounded-circle' alt='Order Image' width='40' height='40'>");
            orderDetails.append(orderImage);

            var orderInfo = $("<div class='flex-grow-1 mx-3'></div>");
            orderInfo.append($("<h6 class='mb-0'>" + menuItem.name + "</h6>"));
            orderInfo.append($("<small>"+ menuItem.price + "</small>"));
            orderDetails.append(orderInfo);

            var orderCount = $("<div class='d-flex align-items-center'></div>");
            orderCount.append($("<button class='btn btn-sm btn-success decrease-count' data-menu-id='" + order.id + "'>-</button>"));
            orderCount.append($("<span class='badge bg-primary mx-2'>" + order.count + "</span>"));
            orderCount.append($("<button class='btn btn-sm btn-success increase-count' data-menu-id='" + order.id + "'>+</button>"));
            orderDetails.append(orderCount);

            var deleteButton = $("<button class='btn btn-sm btn-danger ms-2 delete-order'>Delete</button>");
            deleteButton.click(function () {
                orderList = orderList.filter(item => item.id !== order.id);
                updateSelectedOrders();
            });
            orderDetails.append(deleteButton);

            listItem.append(orderDetails);

            selectedOrdersList.append(listItem);
        });
    }

    function getMenuById(menuId) {
        return menuItems.find(item => item.id === menuId);
    }
});


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
