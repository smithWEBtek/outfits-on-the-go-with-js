$(document).on('turbolinks:load', function() {
  attachListenersForOutfits();
});

class Outfit {
  constructor(outfit) {
    this.id = outfit.id
    outfit.caption? (this.caption = outfit.caption) : false
    this.hashtags = outfit.hashtags
    this.image = outfit.image
    this.board = outfit.board
    this.board_id = outfit.board.id
    this.user = outfit.user
    this.user_id = outfit.user.id
  }

  outfitHTML () {
    let thumbnailHTML = `<input type='image' class='outfit-thumbnail', src='${this.image.url}', data-id='${this.id}', onclick='showOutfit(this)'></input>`
    let captionHTML
    (this.caption != null) ? captionHTML = `<p><font color="grey"><em>${this.caption}</em></font></p>` : false
    return thumbnailHTML + captionHTML
  };
}

//////////////////////LISTENERS/////////////////////////

function attachListenersForOutfits () {
   //list outfits under that hashtag
   $('body').on('click', 'a.tags', function (e) {
     e.preventDefault();
     listTaggedOutfits(this);
    });

    //render create form
   $('body').on('click', '#create-outfit', function (e) {
     e.preventDefault();
     renderForm(this);
   });

   // create outfit
   $('body').on('submit', '#new_outfit', function (e) {
     e.preventDefault();
     createOutfit(this)
    });

   // render edit form
    $('body').on('click', '#edit-outfit', function (e) {
      e.preventDefault();
      renderForm(this);
    });

   // update outfit
    $('body').on('submit', '.edit_outfit', function (e) {
      e.preventDefault();
      updateOutfit(this);
     });

   //  delete outfit
    $('body').on('click', '#delete-outfit', function (e) {
      e.preventDefault();
      deleteOutfit(this)
     });
}

/////////////////////////HANDLERS////////////////////////////

var listOutfits = (outfits) => {
  if (outfits.length) {
    $('.col-lg-12').append('<h1>Outfits</h1>')
    outfits.forEach(function(outfit) {
      var newOutfit = new Outfit(outfit)
      $('.col-lg-12').append(newOutfit.outfitHTML());
    });
  } else {
    $('.col-lg-12').append('<h5>This board has no outfits</h5>')
  };
};

var showOutfit = (outfit) => {
  clear();
  var url = `/outfits/${outfit.dataset.id}`
  $.get(url, function (outfit) {
    $('.col-lg-12').append($('<img>', {class:'outfit-show', src:`${outfit.image.url}`}))
    if (outfit.hashtags) {
      var tagsLabel = "<p>Tags: "
      var tags = []
      outfit.tags.forEach(function(tag) {
        tags.push(`#<a href='#' class="tags" data-id= "${tag.id}" data-name="${tag.name}">${tag.name}</a>`)
      });
      var tagsHTML = tags.join(' ')
      var innerHTML = tagsLabel + tagsHTML + "</p>"
      $('.col-lg-12').append(innerHTML)
      $('.col-lg-12').append(`<button type="button" data-url="/outfits/${outfit.id}/edit" id="edit-outfit" class="btn btn-outline-secondary">Edit</button> <button type="button" data-url="/outfits/${outfit.id}" id="del-outfit" class="btn btn-outline-danger">Delete</button>`)
    };
  });
};

var listTaggedOutfits = (tag) => {
  clear();
  $.get(`/hashtags/${tag.dataset.name}`, function (outfits) {
    if (outfits.length) {
      $('.col-lg-12').append(`<h1>#${tag.dataset.name}</h1>`)
      outfits.forEach(function(outfit) {
        outfitHTML(outfit);
      });
    };
  });
};


var createOutfit = (data) => {
  //image not loading
  debugger
  $.ajax({
    url: data.action,
    type: "POST",
    data: $(data).serialize(),
    success: function(response) {
      let outfit = new Board(response)
      clear();
      showOutfit(outfit)
    }
  });
};

var updateOutfit = () => {

};

var deleteOutfit = (outfit) => {
  $.ajax({
    url: outfit.dataset.url,
    type: "DELETE",
    data: $(outfit).serialize(),
    success: function(response) {
      clear();
      debugger
    }
  });
};
