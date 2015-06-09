"use strict";
// initialize Hoodie
var hoodie  = new Hoodie();

// Todos Collection/View
function Users($element) {
  var collection = [];
  var $el = $element;

  /* Handle "inline editing" of a user.
  $el.on('click', 'label', function() {
    $(this).parent().find('.editing').removeClass('editing');
    $(this).parent().addClass('editing');
    return false;
  });*/

  // Gérer l'édtion en ligne du nom de l'utilisateur
  $el.on('keypress', 'input[id=lastname]', function(event) {
      if (event.keyCode === 13) {
          hoodie.store.update('user', $(this).parent().parent().data('id'), {lastname: event.target.value});
          alert("Mise a jour du nom effectué avec succes");
      }
  });

  // Gérer l'édtion en ligne du prenom de l'utilisateur
  $el.on('keypress', 'input[id=firstname]', function(event) {
      if (event.keyCode === 13) {
          hoodie.store.update('user', $(this).parent().parent().data('id'), {firstname: event.target.value});
          alert("Mise a jour du prenom effectué avec succes");
      }
  });

  // Gérer l'édtion en ligne de l'adresse de l'utilisateur
  $el.on('keypress', 'input[id=address]', function(event) {
      if (event.keyCode === 13) {
          hoodie.store.update('user', $(this).parent().parent().data('id'), {address: event.target.value});
          alert("Mise a jour de l'adresse effectué avec succes");
      }
  });

  // Gérer l'édition en ligne du numero de telephone de l'utilisateur
  $el.on('keypress', 'input[id=telephone]', function(event) {
      if (event.keyCode === 13) {
          hoodie.store.update('user', $(this).parent().parent().data('id'), {telephone: event.target.value});
          alert("Mise a jour du n° de telephone effectué avec succes");
      }
  });

  // Gerer la suppresion d'un utilisateur
  $el.on('click', 'input[id=removebtn]', function() {
      hoodie.store.remove('user', $(this).parent().parent().data('id'));
  });

  // Find index/position of a user in collection.
  function getUserIndexById(id) {
    for (var i = 0, len = collection.length; i < len; i++) {
      if (collection[i].id === id) {
        return i;
      }
    }
    return null;
  }

  function paint() {
    $el.html('');
    collection.sort(function(a, b) {
      return ( a.createdAt > b.createdAt ) ? 1 : -1;
    });
    for (var i = 0, len = collection.length; i<len; i++) {
      $el.append('<tr data-id="'+ collection[i].id + '">'+
          '<td>' + '<input id="lastname" type="text" value="' + collection[i].lastname + '"/>' + '</td>' +
          '<td>' + '<input id="firstname" type="text" value="' + collection[i].firstname + '"/>' + '</td>' +
          '<td>' + '<input id="address" type="text" value="' + collection[i].address + '"/>' + '</td>' +
          '<td>' + '<input id="telephone" type="text" value="' + collection[i].telephone + '"/>' + '</td>' +
          '<td>' + '<input id="removebtn" type="button" value="Remove">' + '</td>' +
          '</tr>'
      );
    }
  }

  this.add = function(user) {
    collection.push(user);
    paint();
  };

  this.update = function(user) {
    collection[getUserIndexById(user.id)] = user;
    paint();
  };

  this.remove = function(user) {
    collection.splice(getUserIndexById(user.id), 1);
    paint();
  };

  this.clear = function() {
    collection = [];
    paint();
  };
}

// Instantiate Todos collection & view.
var users = new Users($('#usertable'));

// initial load of all todo items from the store
hoodie.store.findAll('user').then(function(Users) {
  Users.forEach(users.add);
});

// when a todo changes, update the UI.
hoodie.store.on('user:add', users.add);
hoodie.store.on('user:update', users.update);
hoodie.store.on('user:remove', users.remove);
// clear todos when user logs out,
hoodie.account.on('signout', users.clear);


$('#addbtn').on('click', function (event) {
    hoodie.store.add('user',{
        lastname : $('#lastname').val(),
        firstname : $('#firstname').val(),
        address : $('#address').val(),
        telephone : $('#telephone').val()
    });
    $('#lastname').val('');
    $('#firstname').val('');
    $('#address').val('');
    $('#telephone').val('');

});

/*
$('.removebtn').on('click', function (event) {
    hoodie.store.remove('user',{id : event.id });
});

$('.editbtn').on('click', function (event) {
    $(".content").html('<h3>Editer le contact</h3>' +
    '<form id="edit-form">'+
    '<table class="table col-sm-4">'+
    '<tbody>'+
    '<tr>'+
    '<td>Nom</td>'+
    '<td><input type="text" id="lastnameEdit"  placeholder="Rentrez le nouveau nom" /></td>'+
    '</tr>'+
    '<tr>'+
    '<td>Prenom</td>'+
    '<td><input type="text" id="firstnameEdit"  placeholder="Rentrez le nouveau prenom" /></td>'+
    '</tr>'+
    '<tr>'+
    '<td>Adresse</td>'+
    '<td><input type="text" id="addressEdit"  placeholder="Rentrez la nouvelle adresse" /></td>'+
    '</tr>'+
    '<tr>'+
    '<td>Telephone</td>'+
    '<td><input type="text" id="telephoneEdit"  placeholder="Rentres le nouveau n°tel"/></td>'+
    '</tr>'+
    '<tr>'+
    '<td><button id="savebtn">Save</button></td>'+
    '</tr>'+
    '</tbody>'+
    '</table>'+
    '</form>');
});

$('#savebtn').on('click', function () {
    hoodie.store.update('user',{
        lastname : $('#lastnameEdit').val(),
        firstname : $('#firstnameEdit').val(),
        address : $('#addressEdit').val(),
        telephone : $('#telephoneEdit').val()
    });
    $('#lastnameEdit').val('');
    $('#firstnameEdit').val('');
    $('#addressEdit').val('');
    $('#telephoneEdit').val('');
    $('.content').html('<h3>Ajouter un contact</h3>'+
    '<form id="user-form">'+
    '<table class="table col-sm-4">'+
    '<tbody>'+
    '<tr>'+
    '<td>Nom</td>'+
    '<td><input type="text" id="lastname"  placeholder="Rentrez un nom" /></td>'+
    '</tr>'+
    '<tr>'+
    '<td>Prenom</td>'+
    '<td><input type="text" id="firstname"  placeholder="Rentrez un prenom" /></td>'+
    '</tr>'+
    '<tr>'+
    '<td>Adresse</td>'+
    '<td><input type="text" id="address"  placeholder="Rentrez une adresse" /></td>'+
    '</tr>'+
    '<tr>'+
    '<td>Telephone</td>'+
    '<td><input type="text" id="telephone"  placeholder="N° telephone"/></td>'+
    '</tr>'+
    '<tr>'+
    '<td><button id="addbtn">Add</button></td>'+
    '</tr>'+
    '</tbody>'+
    '</table>'+
    '</form>');

});*/