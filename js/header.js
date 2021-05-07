$(document).ready(function () {
  var $menuBtn = $('.header-nav-menubtn')
  var $menu = $('.header-nav-menu')
  var $menuItem = $('.header-nav-menu-item')
  var $submenu = $('.header-nav-submenu')
  var isMobile = $menuBtn.is(':visible')

  var isMenuShow = false
  var isSubmenuShow = false

  function resetMenuHeight () {
    $menuItem.velocity(
      {
        height: $menuItem.outerHeight()
      },
      {
        complete: function () {
          $submenu.css({ display: 'none', opacity: 0 })
        }
      }
    )
  }

  $(window).on(
    'resize',
    Stun.utils.throttle(function () {
      isMobile = $menuBtn.is(':visible')
      if (isMobile) {
        $submenu.removeClass('hide--force')

        if (isSubmenuShow) {
          resetMenuHeight()
          isSubmenuShow = false
        }
      } else {
        $submenu.css({ display: 'none', opacity: 0 })
      }
    }, 200)
  )

  var isNightModeFocus = true
  var $nightMode = $('.mode')

  $(document).on('click', function () {
    if ($menu.is(':visible')) {
      if (isMobile && isSubmenuShow) {
        resetMenuHeight()
        isSubmenuShow = false
      }
      $menu.css({ display: 'none' })
      isMenuShow = false
    }
    if (isNightModeFocus) {
      $nightMode.removeClass('mode--focus')
      isNightModeFocus = false
    }
  })

  Stun.utils.pjaxReloadHeader = function () {
    $menuBtn = $('.header-nav-menubtn')
    $menu = $('.header-nav-menu')
    $menuItem = $('.header-nav-menu-item')
    $submenu = $('.header-nav-submenu')
    isMobile = $menuBtn.is(':visible')

    isMenuShow = false
    isSubmenuShow = false

    function getNightMode () {
      var nightMode = false
      try {
        if (parseInt(Stun.utils.Cookies().get(NIGHT_MODE_COOKIES_KEY))) {
          nightMode = true
        }
      } catch (err) {
        /* empty */
      }
      return nightMode
    }

    if (CONFIG.nightMode && CONFIG.nightMode.enable) {
      var isNightMode = false
      var NIGHT_MODE_COOKIES_KEY = 'night_mode'
      $nightMode = $('.mode')
      isNightModeFocus = true

      if (getNightMode()) {
        $nightMode.addClass('mode--checked')
        $nightMode.addClass('mode--focus')
        $('html').addClass('nightmode')
        isNightMode = true
      } else {
        isNightMode = false
      }
      $('.mode').on('click', function (e) {
        e.stopPropagation()
        isNightMode = !isNightMode
        isNightModeFocus = true
        Stun.utils.Cookies().set(NIGHT_MODE_COOKIES_KEY, isNightMode ? 1 : 0)
        $nightMode.toggleClass('mode--checked')
        $nightMode.addClass('mode--focus')
        $('html').toggleClass('nightmode')
      })
    }

    $menuBtn.on('click', function (e) {
      e.stopPropagation()
      if (isMobile && isMenuShow && isSubmenuShow) {
        resetMenuHeight()
        isSubmenuShow = false
      }
      if (!isMenuShow) {
        isMenuShow = true
      } else {
        isMenuShow = false
      }
      $menu.velocity('stop').velocity(
        {
          opacity: isMenuShow ? 1 : 0
        },
        {
          duration: isMenuShow ? 200 : 0,
          display: isMenuShow ? 'block' : 'none'
        }
      )
    })

    // Whether to allow events to bubble in the menu.
    var isBubbleInMenu = false
    $('.header-nav-submenu-item').on('click', function () {
      isBubbleInMenu = true
    })

    $menuItem.on('click', function (e) {
      if (!isMobile) {
        return
      }
      var $submenu = $(this).find('.header-nav-submenu')
      if (!$submenu.length) {
        return
      }
      if (!isBubbleInMenu) {
        e.stopPropagation()
      } else {
        isBubbleInMenu = false
      }

      var menuItemHeight = $menuItem.outerHeight()
      var submenuHeight =
        menuItemHeight + Math.floor($submenu.outerHeight()) * $submenu.length
      var menuShowHeight = 0

      if ($(this).outerHeight() > menuItemHeight) {
        isSubmenuShow = false
        menuShowHeight = menuItemHeight
      } else {
        isSubmenuShow = true
        menuShowHeight = submenuHeight
      }
      $submenu.css({ display: 'block', opacity: 1 })
      // Accordion effect.
      $(this)
        .velocity('stop')
        .velocity({ height: menuShowHeight }, { duration: 300 })
        .siblings()
        .velocity({ height: menuItemHeight }, { duration: 300 })
    })

    $menuItem.on('mouseenter', function () {
      var $submenu = $(this).find('.header-nav-submenu')
      if (!$submenu.length) {
        return
      }
      if (!$submenu.is(':visible')) {
        if (isMobile) {
          $submenu.css({ display: 'block', opacity: 1 })
        } else {
          $submenu.removeClass('hide--force')
          $submenu
            .velocity('stop')
            .velocity('transition.slideUpIn', { duration: 200 })
        }
      }
    })

    $menuItem.on('mouseleave', function () {
      var $submenu = $(this).find('.header-nav-submenu')
      if (!$submenu.length) {
        return
      }
      if (!isMobile) {
        $submenu.addClass('hide--force')
        isSubmenuShow = false
      }
    })
  }

  Stun.utils.pjaxReloadScrollIcon = function () {
    if (CONFIG.header && CONFIG.header.scrollDownIcon) {
      $('.header-banner-arrow').on('click', function (e) {
        e.stopPropagation()
        $('#container').velocity('scroll', {
          offset: $('#header').outerHeight()
        })
      })
    }
  }

  // Initializaiton
  Stun.utils.pjaxReloadHeader()
  Stun.utils.pjaxReloadScrollIcon()
})


// 添加鼠标划过的星星特效
$(document).ready(function fairyDustCursor() {
  
  var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
  var width = window.innerWidth;
  var height = window.innerHeight;
  var cursor = {x: width/2, y: width/2};
  var particles = [];
  
  function init() {
    bindEvents();
    loop();
  }
  
  // Bind events that are needed
  function bindEvents() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchstart', onTouchMove);
    
    window.addEventListener('resize', onWindowResize);
  }
  
  function onWindowResize(e) {
    width = window.innerWidth;
    height = window.innerHeight;
  }
  
  function onTouchMove(e) {
    if( e.touches.length > 0 ) {
      for( var i = 0; i < e.touches.length; i++ ) {
        addParticle( e.touches[i].clientX, e.touches[i].clientY, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
      }
    }
  }
  
  function onMouseMove(e) {    
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    
    addParticle( cursor.x, cursor.y, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
  }
  
  function addParticle(x, y, color) {
    var particle = new Particle();
    particle.init(x, y, color);
    particles.push(particle);
  }
  
  function updateParticles() {
    
    for( var i = 0; i < particles.length; i++ ) {
      particles[i].update();
    }
    
    for( var i = particles.length -1; i >= 0; i-- ) {
      if( particles[i].lifeSpan < 0 ) {
        particles[i].die();
        particles.splice(i, 1);
      }
    }
    
  }
  
  function loop() {
    requestAnimationFrame(loop);
    updateParticles();
  }
  
  function Particle() {

    this.character = "*";
    this.lifeSpan = 120; //ms
    this.initialStyles ={
      "position": "fixed",
      "top": "0", //必须加
      "display": "block",
      "pointerEvents": "none",
      "z-index": "10000000",
      "fontSize": "20px",
      "will-change": "transform"
    };

    this.init = function(x, y, color) {

      this.velocity = {
        x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
        y: 1
      };
      
      this.position = {x: x - 10, y: y - 20};
      this.initialStyles.color = color;
      console.log(color);

      this.element = document.createElement('span');
      this.element.innerHTML = this.character;
      applyProperties(this.element, this.initialStyles);
      this.update();
      
      document.body.appendChild(this.element);
    };
    
    this.update = function() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.lifeSpan--;
      
      this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + (this.lifeSpan / 120) + ")";
    }
    
    this.die = function() {
      this.element.parentNode.removeChild(this.element);
    }
    
  }
  
  function applyProperties( target, properties ) {
    for( var key in properties ) {
      target.style[ key ] = properties[ key ];
    }
  }
  
  init();
})