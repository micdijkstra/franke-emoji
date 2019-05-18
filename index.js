!(function($) {
  // Franke
  var Environment,
    addToChannel,
    canvas,
    collapseSlackContainer,
    context,
    createEmail,
    disableHotDog,
    drawShadow,
    emails,
    emojiFun,
    emojiNumber,
    enableEmojiFun,
    enableHotDog,
    environment,
    expandSlackContainer,
    fly,
    gravity,
    hotDog,
    images,
    init,
    loadImages,
    positionSlackContainer,
    randomNumber,
    regeneratingEmails,
    safetyLine,
    scheduleEmail,
    showMessage,
    slackContainer,
    velocity,
    worldRect;

  $(document).on("ready page:load", function() {
    hotDog = false;
    emojiFun = false;
    emojiNumber = 3;
    images = [
      {
        src: "./assets/emoji-email.png",
        channel: "general"
      },
      {
        src: "./assets/emoji-football.png",
        channel: "watercooler"
      },
      {
        src: "./assets/emoji-pizza.png",
        channel: "pizza"
      },
      {
        src: "./assets/emoji-cool.png",
        channel: "cool"
      },
      {
        src: "./assets/emoji-phone.png",
        channel: "sales"
      },
      {
        src: "./assets/emoji-business.png",
        channel: "sales"
      },
      {
        src: "./assets/emoji-fax.png",
        channel: "support"
      },
      {
        src: "./assets/emoji-cactus.png",
        channel: "cactus"
      },
      {
        src: "./assets/emoji-okay.png",
        channel: "ok"
      },
      {
        src: "./assets/emoji-shroom.png",
        channel: "shrooms"
      },
      {
        src: "./assets/emoji-eggplant.png",
        channel: "eggplant"
      },
      {
        src: "./assets/emoji-banana.png",
        channel: "banana"
      },
      {
        src: "./assets/emoji-hot-dog-l.png",
        channel: "hotdog"
      }
    ];
    loadImages = function() {
      var i, image, img, len, results;
      results = [];
      for (i = 0, len = images.length; i < len; i++) {
        image = images[i];
        img = new Image();
        img.src = image.src;
        results.push((image.file = img));
      }
      return results;
    };
    randomNumber = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    addToChannel = function(channel) {
      var element;
      element = $("[data-slack-channel='" + channel + "']");
      if (element.attr("data-message-channel") !== void 0) {
        $("[data-message-channel].active").removeClass("active");
      }
      element.addClass("active");
      if (element.attr("data-emoji-fun") !== void 0) {
        element.fadeIn(200);
      }
      return setTimeout(function() {
        if (hotDog && element.attr("data-slack-channel") === "hotdog") {
          return element.removeClass("active");
        } else if (element.attr("data-emoji-fun") !== void 0) {
          return element.fadeOut(200, function() {
            return element.removeClass("active");
          });
        } else if (element.attr("data-message-channel") === void 0) {
          return element.removeClass("active");
        }
      }, 800);
    };
    showMessage = function(message) {
      var $message;
      if (message !== void 0) {
        $("[data-slack-message-header]").addClass("active");
        $message = $("[data-slack-message='" + message + "']");
        $("[data-slack-message].active").removeClass("active");
        return $message.addClass("active");
      }
    };
    enableEmojiFun = function() {
      if (emojiFun) {
        return;
      }
      return (emojiFun = true);
    };
    disableEmojiFun = function() {
      if (!emojiFun) {
        return;
      }
      return (emojiFun = false);
    };
    enableHotDog = function() {
      if (hotDog) {
        return;
      }
      setTimeout(function() {
        return (hotDog = true);
      }, 100);
      return $("[data-slack-channel=hotdog]").fadeIn();
    };
    disableHotDog = function() {
      if (!hotDog) {
        return;
      }
      $("[data-slack-channel=hotdog]").fadeOut();
      return setTimeout(function() {
        var i, index, ref, results;
        if (hotDog) {
          hotDog = false;
          results = [];
          for (
            index = i = 0, ref = emojiNumber - 1 - regeneratingEmails().length;
            0 <= ref ? i <= ref : i >= ref;
            index = 0 <= ref ? ++i : --i
          ) {
            results.push(
              setTimeout(function() {
                return scheduleEmail();
              }, randomNumber(index * 1000, index * 2000))
            );
          }
          return results;
        }
      }, 100);
    };
    expandSlackContainer = function() {
      if ($("[data-slack-container]").hasClass("expanded")) {
        return;
      }
      $("[data-slack-container]").addClass("expanded");
      $(
        "[data-slack-channel=watercooler], [data-slack-channel=general], [data-slack-channel=pizza], [data-slack-channel=support], [data-slack-channel=sales]"
      ).hide();
      $("[data-message-channel]").fadeIn(200);
      environment.setEnvironment();
      return setTimeout(function() {
        return environment.setEnvironment();
      }, 1000);
    };
    collapseSlackContainer = function() {
      if (!$("[data-slack-container]").hasClass("expanded")) {
        return;
      }
      $("[data-slack-container]").removeClass("expanded");
      $(
        "[data-slack-channel=watercooler], [data-slack-channel=general], [data-slack-channel=pizza], [data-slack-channel=support], [data-slack-channel=sales]"
      ).fadeIn(200);
      $("[data-message-channel]").hide();
      environment.setEnvironment();
      return setTimeout(function() {
        return environment.setEnvironment();
      }, 1000);
    };
    Environment = function() {
      return {
        setEnvironment: function() {
          worldRect.width = $(window).width();
          worldRect.height = $(window).height();
          canvas.width = worldRect.width;
          canvas.height = worldRect.height;
          slackContainer.height = $("[data-slack-container]").height();
          slackContainer.top = $("[data-slack-container]").offset().top;
          slackContainer.bottom =
            $("[data-slack-container]").offset().top +
            $("[data-slack-container]").height();
          slackContainer.left = $("[data-slack-container]").offset().left;
          slackContainer.middle = Math.floor(
            slackContainer.top + slackContainer.height / 2
          );
          this.left = worldRect.x;
          this.right = slackContainer.left;
          this.top = worldRect.y;
          return (this.bottom = worldRect.y + worldRect.height);
        },
        collisionX: function(object) {
          var collide;
          collide = false;
          if (object.pos.x >= this.right - object.image.width / 2) {
            collide = true;
          }
          return collide;
        },
        collisionY: function(object) {
          var collide;
          collide = false;
          if (object.pos.y >= this.bottom) {
            collide = true;
          }
          return collide;
        }
      };
    };
    createEmail = function(args) {
      var email,
        image,
        image_data,
        maxY,
        minY,
        regenerate,
        startingY,
        velocityX,
        velocityY;
      args || (args = {});
      if (args["image"] !== void 0) {
        image_data = images[args["image"]];
      } else if (hotDog) {
        image_data = images[images.length - 1];
      } else if (emojiFun) {
        image_data = images[randomNumber(0, images.length - 2)];
      } else {
        image_data = images[0];
      }
      if (args["channel"] !== void 0) {
        image_data.channel = args["channel"];
      }
      if (args["straight"] !== void 0) {
        velocityX = 15;
        velocityY = 0;
      } else if (hotDog && args["ignore_hotdog"] === void 0) {
        velocityX = 2;
        velocityY = 2;
      } else {
        velocityX = randomNumber(5, 15);
        velocityY = randomNumber(3, 4);
      }
      image = image_data.file;
      if (hotDog && args["ignore_hotdog"] === void 0) {
        minY = Math.floor(slackContainer.bottom - image.height);
      } else {
        minY = Math.floor(
          slackContainer.top +
            image.height / 2 +
            randomNumber(0, slackContainer.height * 0.25 - image.height / 2)
        );
      }
      if (hotDog && args["ignore_hotdog"] === void 0) {
        maxY = slackContainer.bottom;
      } else {
        maxY = Math.floor(
          slackContainer.bottom -
            image.height / 2 -
            randomNumber(0, slackContainer.height * 0.25 - image.height / 2)
        );
      }
      if (hotDog && args["ignore_hotdog"] === void 0) {
        startingY = Math.floor(maxY - image.height);
      } else if (args["startingY"] === void 0) {
        startingY = randomNumber(minY, maxY);
      } else {
        startingY = Math.floor(args["startingY"] - image.height / 2);
      }
      if (args["regenerate"] === void 0) {
        regenerate = true;
      } else {
        regenerate = args["regenerate"];
      }
      minY = randomNumber(slackContainer.top + image.height / 2, startingY);
      maxY = randomNumber(startingY, slackContainer.bottom - image.height / 2);
      email = {
        channel: image_data.channel,
        message: args["message"],
        image: image,
        height: Math.floor(image.height / 2),
        width: Math.floor(image.width / 2),
        pos: {
          x: Math.floor(-image.width / 2 + 1),
          y: startingY,
          maxY: maxY,
          minY: minY
        },
        angle: 0,
        velocityY: velocityY,
        velocityX: velocityX,
        alive: true,
        timeToExpire: void 0,
        safe: false,
        regenerate: regenerate
      };
      return emails.push(email);
    };
    scheduleEmail = function(timer) {
      timer = typeof timer === "undefined" ? randomNumber(0, 3000) : timer;
      return setTimeout(function() {
        if (hotDog) {
          if (regeneratingEmails().length === 0) {
            return createEmail();
          }
        } else {
          return createEmail();
        }
      }, timer);
    };
    fly = function(email) {
      var index;
      context.save();
      if (!email.safe && environment.collisionX(email)) {
        if (
          email.safe ||
          (email.alive &&
            safetyLine < email.pos.y &&
            email.pos.y > slackContainer.top &&
            email.pos.y < slackContainer.bottom - email.height)
        ) {
          email.safe = true;
          email.alive = false;
          email.timeToExpire = $.now() + 1000;
          addToChannel(email.channel);
          showMessage(email.message);
          index = emails.indexOf(email);
          if (index > -1) {
            emails.splice(index, 1);
          }
          if (email.regenerate) {
            scheduleEmail();
          }
          return;
        } else if (environment.collisionY(email)) {
          if (email.alive) {
            email.alive = false;
            index = emails.indexOf(email);
            if (index > -1) {
              emails.splice(index, 1);
            }
            if (email.regenerate) {
              scheduleEmail();
            }
            email = void 0;
            return;
          }
        } else {
          email.angle -= email.velocityX;
          email.pos.y += gravity;
          drawShadow(email);
        }
        context.translate(Math.floor(email.pos.x), Math.floor(email.pos.y));
        context.rotate((Math.PI / 180) * email.angle);
        context.drawImage(
          email.image,
          Math.floor(-email.width / 2),
          Math.floor(-email.height / 2),
          email.width,
          email.height
        );
      } else {
        if (email.pos.y >= email.pos.maxY) {
          email.velocityY *= -1;
          email.velocityX *= 0.95;
        } else if (email.pos.y <= email.pos.minY) {
          email.velocityY *= -1;
          email.velocityX *= 1.05;
        }
        email.pos.x += email.velocityX;
        email.pos.y += email.velocityY;
        drawShadow(email);
        context.drawImage(
          email.image,
          Math.floor(email.pos.x),
          Math.floor(email.pos.y),
          email.width,
          email.height
        );
      }
      return context.restore();
    };
    drawShadow = function(email) {
      var h, kappa, ox, oy, style, w, x, xe, xm, y, ye, ym;
      if (email.safe) {
        return;
      }
      x = Math.floor(email.pos.x - email.width / 2);
      y = Math.floor(worldRect.height - 25);
      h = Math.floor(email.height / email.pos.y) * 10;
      w = email.width;
      style = "rgba(0,0,0, 0.2)";
      kappa = 0.5522848;
      ox = (w / 2) * kappa;
      oy = (h / 2) * kappa;
      xe = x + w;
      ye = y + h;
      xm = x + w / 2;
      ym = y + h / 2;
      context.save();
      context.beginPath();
      context.moveTo(x, ym);
      context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      context.fillStyle = style;
      context.fill();
      context.restore();
    };
    window.draw = function() {
      var email, i, len;
      context.clearRect(
        worldRect.x,
        worldRect.y,
        worldRect.width,
        worldRect.height
      );
      for (i = 0, len = emails.length; i < len; i++) {
        email = emails[i];
        if (email) {
          fly(email);
        }
      }
      return window.requestAnimationFrame(draw);
    };
    init = function() {
      var i, index, ref, safetyLine;
      safetyLine = 0;
      environment.setEnvironment();
      scheduleEmail(0);
      for (
        index = i = 0, ref = emojiNumber;
        0 <= ref ? i <= ref : i >= ref;
        index = 0 <= ref ? ++i : --i
      ) {
        setTimeout(function() {
          return scheduleEmail();
        }, randomNumber(index * 1000, index * 2000));
      }
      return window.draw();
    };
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    velocity = 5;
    gravity = 10;
    safetyLine = $(window).height();
    slackContainer = {
      top: 0,
      bottom: 0,
      left: 0,
      height: 0
    };
    environment = new Environment();
    emails = [];
    regeneratingEmails = function() {
      return emails.filter(function(email) {
        return email.regenerate;
      });
    };
    worldRect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    loadImages();
    positionSlackContainer = function() {
      var child, parent, topMargin;
      parent = $("[data-slack-container]");
      child = $("[data-slack-container]").find("[data-slack-container-child]");
      if ($(window).height() > 600) {
        topMargin = (parent.height() - child.height()) / 2;
        return child.css("margin-top", topMargin);
      } else {
        return child.css("margin-top", 100);
      }
    };

    setInterval(function() {
      if (!emojiFun) {
        $(".index-article-cta span").text("With Franke");
        safetyLine = -1;
        return enableEmojiFun();
      }

      if (!hotDog) {
        return enableHotDog();
      }

      $(".index-article-cta span").text("Without Franke");
      safetyLine = $(window).height();
      disableHotDog();
      disableEmojiFun();
      return;
    }, 10000);

    $(window).resize(function() {
      environment.setEnvironment();
      return positionSlackContainer();
    });
    $(
      "[data-nav], [data-slack-container], [data-emoji-fun], [data-message-channel], [data-index-cta]"
    ).hide();
    $("[data-slack-channel]").css({
      visibility: "hidden"
    });
    return $(document).ready(function() {
      $("[data-nav]").fadeIn(300);
      positionSlackContainer();
      setTimeout(function() {
        $("[data-index-cta=1]").fadeIn(400);
        $("[data-franke-container]").addClass("active");
        return $("[data-slack-container]").fadeIn(300, function() {
          init();
          positionSlackContainer();
          return $("[data-slack-channel]").each(function(index) {
            var channel;
            channel = this;
            if ($(this).attr("data-emoji-fun") === void 0) {
              return setTimeout(function() {
                return $(channel).css({
                  visibility: "visible"
                });
              }, 100 * index);
            } else {
              return $(channel)
                .css("visibility", "visible")
                .hide();
            }
          });
        });
      }, 500);
    });
  });
})(window.jQuery);
