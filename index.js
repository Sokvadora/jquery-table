let storedNames = JSON.parse(localStorage.getItem("products")) || {};

let errorObject = {
  resetError:arg => {$(arg).remove();},
  invalidClass: arg => {arg.removeClass("valid").addClass("invalid");},
  validClass: arg => {arg.removeClass("invalid").addClass("valid");}
};

async function searchProduct() {
  let inputSearch = await $(".product-search").val().trim();
  let arrForSearch = [];

  for (let i in storedNames) {
    arrForSearch.push(inputSearch == storedNames[i].name);
  }

  if (arrForSearch.includes(true)) {
    $(`tbody tr:not(:contains("${inputSearch}"))`).hide();
  } else {
    $("tbody tr ").show();
  }
}

async function appendProductInTable(arg) {
  newId = arg;
  $("tbody tr ").hide();
  let dataForItemTemplate = product => {
    return {
      name: product.name,
      count: product.count,
      price: product.price,
      id: product.id
    };
  };

  let obj = storedNames;

  for (let i in obj) {
    productItem = obj[i];
    let template = await $("#template-product-item").html();
    let compiledTemplate = await _.template(template);
    const dataOfTemplaete = product => {
      return compiledTemplate(dataForItemTemplate(product));
    };

    let arr = [];
    arr.push(productItem);
    let htmlTemplaete = arr.map(dataOfTemplaete).join("");
    $("#myTable tr:last").after(htmlTemplaete);
  }
  setTimeout(editProduct, 1000);
  deleteProduct();

  $(".btn-search ").click(function(event) {
    event.preventDefault();
    searchProduct();
  });

  $(".btn-search").on("keypress", function(event) {
    if (event.which == 13) {
      searchProduct();
    }
  });
}

function validation() {
  let idForValidation = [];

  $(".add-product-modal-content > input").each(function (index, element) {
    idForValidation.push($(element).attr("id"));
  });

  for (let id of idForValidation) {
    switch (id) {
      case "name":
        const nameSpace = $(".product-name").val().replace(/ /g, "");

        if (!nameSpace) {
          errorObject.invalidClass($(".product-name"));
          $(".product-name").after("<p class='error'> </p>")
          errorObject.resetClass('error')
          $(".error").addClass('nameIsNull')
          $(".nameIsNull").text("Value is null");

        } else if (nameSpace.length < 5) {
          errorObject.resetError(".error")
          $(".product-name").after("<p class='error'> </p>")
          $('.error').attr('class', 'error');
          $(".error").addClass('minLength')
          $(".minLength").text("minLength");
          errorObject.invalidClass($(".product-name"));

        } else if (nameSpace.length > 15) {
          errorObject.resetError(".error")
          $(".product-name").after("<p class='error'> </p>")
          $('.error').attr('class', 'error');
          $(".error").addClass('maxLength')
          $(".maxLength").text("maxLength");
          errorObject.invalidClass($(".product-name"));

        } else {
          errorObject.resetError(".error")
          errorObject.validClass($(".product-name"));
        }
        break;

      case "email":
        const validEmail = $(".mail").val().replace(/ /g, "");
        const emaqlReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!validEmail) {
          errorObject.resetError(".errorEmail")
          $(".mail").after("<p class='errorEmail'> </p>")
          $('.errorEmail').attr('class', 'errorEmail');
          $(".errorEmail").addClass('nullEmail')
          $(".nullEmail").text("nullEmail");
          errorObject.invalidClass($(".mail"));

        } else if (!emaqlReg.test(validEmail)) {
          errorObject.resetError(".errorEmail")
          $(".mail").after("<p class='errorEmail'> </p>")
          $('.errorEmail').attr('class', 'errorEmail');
          $(".errorEmail").addClass('invalidEmail')
          $(".invalidEmail").text("invalidEmail");
          errorObject.invalidClass($(".mail"));

        } else {
          errorObject.resetError(".errorEmail")
          errorObject.validClass($(".mail"));
        }
        break;

      case "count": {
        const validdCount = $(".count").val().replace(/ /g, "");

        if (!validdCount) {
          errorObject.resetError(".errorCount")
          $(".count").after("<p class='errorCount'> </p>");
          $(".errorCount").text("errorCount");
          errorObject.invalidClass($(".count"));

        } else {
          errorObject.resetError(".errorCount")
          errorObject.validClass($(".count"));
        }
      }
        break;

     case "price": {
       const validPrice = $(".price").val().replace(/ /g, "");

      if (!validPrice) {
        errorObject.resetError(".errorPrice");
        $(".price").after("<p class='errorPrice'> </p>");
        $(".errorPrice").text("errorPricet");
        errorObject.invalidClass($(".price"));

      } else {
        errorObject.validClass($(".price"));
        errorObject.resetError(".errorPrice")
      }
    }
    }
  }
}


function selectDelivery() {
  let countries = {
    ru: {
      city1: "Moskow",
      city2: "St.Petersburg",
      city3: "Saratov"
    },
    usa: {
      city1: "San Diego",
      city2: "Chicago",
      city3: "Denver"
    },
    blr: {
      city1: "Minsk",
      city2: "Orsha",
      city3: "Grodno"
    }
  };
  let citylist = _.template($("#devivery").html());
  let identifier = $("#select-country option:selected").val();
  $("#countriesForSelect").html(citylist(countries[identifier]));
}

async function addNewProduct() {
  $(".count").on("input change", function() {
    let validCount = $(".count").val();
    $(".count").val(validCount.replace(/[\W_a-zA-Zа-яА-Я]/g, ""));
  });

  $(".price").blur(function() {
    let validPrice = $(".price").val();
    let format;
    validPrice = $(".price").val(validPrice.replace(validPrice, validPrice.substring(0, 9)));
    newValidPrice = $(".price").val();
    let validate = (+newValidPrice).toFixed(2).split(".");
    format = ["$", priceFormat(validate[0] | 0), ".", validate[1]].join("");
    $(".price").val(newValidPrice.replace(newValidPrice, format));

    function priceFormat(num) {
      let str = num + "";
      let arr = [];
      let i = str.length - 1;

      while (i >= 0) {
        arr.push((str[i - 2] || "") + (str[i - 1] || "") + (str[i] || ""));
        i = i - 3;
      }
      return arr.reverse().join(",");
    }
  });

  let products = {};

  $(".btn-save").click(async function() {
    let localId = localStorage.getItem("id") || 0;
    $(".first").text(`${localId}`);
    let newId = $(".first").text();
    newId = Number(newId) + 1;
    newId = String(newId);

    validation();
    const productName = $(".product-name").val();
    const productCount = $(".count").val();
    const productPrice = $(".price").val();
    const supplierEmail = $(".mail").val();

    if ($(".valid").length < 4) {
      $(".invalid")[0].focus();
      console.log($(".error"))
      return false;
       
    } else {
      localStorage.setItem("id", newId);

      products = {
        name: productName,
        count: productCount,
        price: productPrice,
        email: supplierEmail,
        id: newId
      };

      let existingObject = localStorage.getItem("products");
      let objectName = products.id;
      existingObject = existingObject ? JSON.parse(existingObject) : {};
      existingObject[`${objectName}`] = products;
      localStorage.setItem("products", JSON.stringify(existingObject));

      appendProductInTable(newId);
      $(".add-product-modal").hide();
      setTimeout($(".val-product").attr("id", `${newId}`), 2000);
      location.reload();
    }
  });

  $(".btn-cancel").click(async function() {
    $("input").val("");
    $(".add-product-modal").hide();
    location.reload();
  });
}

function editProduct() {
  $(".btn-edit").click(function() {
    $(".add-product-modal").show();
    $(".btn-save").unbind("click");
    selectCity();

    let thisProductId = $(this).parents(".product-row").find(".val-product").attr("id");
    let oldProducts = JSON.parse(localStorage.getItem("products"));
    let nameEditProduct = oldProducts[thisProductId].name,
      priceEditProduct = oldProducts[thisProductId].price,
      countEditProduct = oldProducts[thisProductId].count,
      emailEditProduct = oldProducts[thisProductId].email,
      newName = $(".product-name"),
      newPrice = $(".price"),
      newCount = $(".count"),
      newEmail = $(".mail");

    $(".add-product-modal").show();

    newName.val(nameEditProduct);
    newPrice.val(priceEditProduct);
    newCount.val(countEditProduct);
    newEmail.val(emailEditProduct);

    $(".btn-save").click(function() {
      validation();
      if ($(".valid").length < 4) {
        errorObject.setFocus($(".invalid"));
        $(".invalid")[0].focus();
        return false;

      } else {
        nameEditProduct = newName.val();
        priceEditProduct = newPrice.val();
        countEditProduct = newCount.val();
        emailtEditProduct = newEmail.val();

        let newProducts = {
          name: nameEditProduct,
          count: countEditProduct,
          price: priceEditProduct,
          email: emailtEditProduct,
          id: thisProductId
        };

        $(".product-name").val("");
        $(".count").val("");
        $(".price").val("");
        $(".add-product-modal").hide();

        let objectName = newProducts.id;
        storedNames[`${objectName}`] = newProducts;
        localStorage.setItem("products", JSON.stringify(storedNames));
      }
      location.reload();
    });
  });
}
function deleteProduct() {
  $(".btn-delete").click(function() {
    $(".space-for-delete-product-modal").show();
    let nameDeleteProduct = $(this).parents(".product-row").find(".val-product").text();
    let context = this;
    console.log(this);
    $(".delete-product-name").html(`Are you sure you want to delete ${nameDeleteProduct}?`);
    $(".btn-save").unbind("click");

    $(".btn-yes").click(function() {
      let pr = JSON.parse(localStorage.getItem("products"));
      let num = $(context).parents(".product-row").find(".val-product").attr("id");
      delete pr[num];
      localStorage.setItem("products", JSON.stringify(pr));
      $(".space-for-delete-product-modal").hide();
      location.reload();
    });

    $(".btn-no").click(function() {
      $(".space-for-delete-product-modal").hide();
    });
  });
}

function sortAction(name, column) {
  $(name).unbind("click");
  let tbody = $("#myTable tbody");
  let state = 1;
  let arrow = $(name).siblings().find("i");
  return function() {
    if (state === 1) {
      state = 2;
      tbody.find("tr").sort((a, b) => {
          a = $(a).find(column).text();
          b = $(b).find(column).text();
          return a > b ? 1 : a < b ? -1 : 0;
        }).appendTo(tbody);
      $(arrow).removeClass();
      $(arrow).toggleClass("fas fa-caret-up");
    } else if (state === 2) {
      state = 1;
      tbody .find("tr").sort((a, b) => {
          a = $(a).find(column).text();
          b = $(b).find(column).text();
          return a < b ? 1 : a > b ? -1 : 0;
        }).appendTo(tbody);
      $(arrow).removeClass();
      $(arrow).toggleClass("fas fa-caret-down");
    }
  };
}

function sortTable(name, column) {
  $(name).click(sortAction(name, column));
}
sortTable(".col-name", "td:eq(0)");
sortTable(".col-price", "td:eq(1)");

let arrForDelivery = [];

function selectCity() {
  $("#select-country").change(function() {
    selectDelivery();

    $("input:checkbox").change(function() {
      const selectCity = $(this).next().text();
      if (selectCity === "Select all") {
        $(":checkbox").each(function() {
          this.checked = true;
        });
      } else {
        $(":checkbox").each(function() {
          this.checked = false;
        });
        this.checked = true;
      }
    });
  });
}

let showProducts = new Promise((res, rej) => {
  setTimeout(() => {
    $(document).ready(function() {
      $(".btn-add-new").click(function() {
        $(".add-product-modal").show();
        selectCity();
      });
    });
    res();
  }, 300);
});

showProducts
  .then(() => {appendProductInTable();})
  .then(() => {setTimeout(addNewProduct, 1000);});
