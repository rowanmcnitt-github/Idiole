// Global Variables //

let nouns = ["crayfish", "tadpole", "sea_urchen", "Frog","Crocodile","Alligator","Salamander","Toad","Newt","Iguana","Snake","Dragon","Lion","Tiger","Goat","Horse","Donkey","Dog","Cat","Pig","Panther","Leopard","Cheetah","Cow","Walrus","Otter","Giraffe","Sheep","Rabbit","Monkey","Tortoise","Turtle","Lizard","Chameleon","Basilisk","Fox","Gecko","Herring","Crab","Brill","Haddock","Eel","Whale","Blue_whale","Salmon","Sardines","Pike","Carp","Shark","Tuna","Pufferfish","Blue_tang","Flamingo","Crow","Hen","Vulture","Eagle","Peacock","Pigeon","Emu","Ostrich","Dove","Stork"]
let adjectives = ["religious","secular","outrageous", "hoppy","adorable","adventurous","aggressive","agreeable","alert","alive","amused","angry","annoyed","annoying","anxious","arrogant","ashamed","attractive","average","awful","bad","beautiful","better","bewildered","black","bloody","blue","blue-eyed","blushing","bored","brainy","brave","breakable","bright","busy","calm","careful","cautious","charming","cheerful","clean","clear","clever","cloudy","clumsy","colorful","combative","comfortable","concerned","condemned","confused","cooperative","courageous","crazy","creepy","crowded","cruel","curious","cute","dangerous","dark","dead","defeated","defiant","delightful","depressed","determined","different","difficult","disgusted","distinct","disturbed","dizzy","doubtful","drab","dull","eager","easy","elated","elegant","embarrassed","enchanting","encouraging","energetic","enthusiastic","envious","evil","excited","expensive","exuberant","fair","faithful","famous","fancy","fantastic","fierce","filthy","fine","foolish","fragile","frail","frantic","friendly","frightened","funny","gentle","gifted","glamorous","gleaming","glorious","good","gorgeous","graceful","grieving","grotesque","grumpy","handsome","happy","healthy","helpful","helpless","hilarious","homeless","homely","horrible","hungry","hurt","ill","important","impossible","inexpensive","innocent","inquisitive","itchy","jealous","jittery","jolly","joyous","kind","lazy","light","lively","lonely","long","lovely","lucky","magnificent","misty","modern","motionless","muddy","mushy","mysterious","nasty","naughty","nervous","nice","nutty","obedient","obnoxious","odd","old-fashioned","open","outrageous","outstanding","panicky","perfect","plain","pleasant","poised","poor","powerful","precious","prickly","proud","putrid","puzzled","quaint","real","relieved","repulsive","rich","scary","selfish","shiny","shy","silly","sleepy","smiling","smoggy","sore","sparkling","splendid","spotless","stormy","strange","stupid","successful","super","talented","tame","tasty","tender","tense","terrible","thankful","thoughtful","thoughtless","tired","tough","troubled","ugliest","ugly","uninterested","unsightly","unusual","upset","uptight","vast","victorious","vivacious","wandering","weary","wicked","wide-eyed","wild","witty","worried","worrisome","wrong","zany","zealous"]

let clickable_objects = {}
let fonts = {}
let images = {}
let colors = {
  'background': '#1E1F20',
  'unfilled_text': '#313638',
  'background_right': '#192313',
  'text_normal': '#E8E9EB',
  'text_unemphasized': '#E0DFD5',
  'text_almost_right': '#F09D51',
  'text_wrong': '#F74141',
  'text_right': '#80F043',
  'text_right_second': '#4D9B23',
  'text_inactive': '#717778',
  'text_jitter': '#F7414149',
}
let render_options = {
  'display_boundaries': false,
  'display_boundaries_all': false,
  'bevel': 4,
  'font_size_multiplier': 1.5,
}
let database;

let idiom_dictionary = {}

//                  //

// game options //

let max_attempts = 8

// stats variables //

let game_stats = {
  score: 0,
  time: -1,
  attempts: 8,
  won: false,
  username: '',
  username_color: undefined,
  game_space_index: undefined,
}

let game_stats_elements = {
  timer_element: undefined,
  attempts_element: undefined,
  username_element: undefined,
}

let idiom_structs = {
  word_array: undefined,
  guessed_dict: {},
  letter_elements: {},
  answer_array: undefined,
  letter_counts: undefined,
  underlined_words: [],
}

// 

let current_screen;
let screen = {}


function preload()
{
  fonts['title_font'] = loadFont('assets/fonts/avenue_font.otf')
  fonts['regular_font'] = loadFont('assets/fonts/Roboto-Bold.ttf')
  fonts['coolvetica_italics'] = loadFont('assets/fonts/Roboto-MediumItalic.ttf')
  
  images['timer'] = loadImage('assets/images/timer_icon.png')
  images['retry'] = loadImage('assets/images/retry_icon.png')
  images['stripe_pattern'] = loadImage('assets/images/stripe_pattern.png')
  images['tutorial_image'] = loadImage('assets/images/tutorial_image.png')
}
function configure_firebase()
{
  //FIREBASE SETUP
  //============================//
  const firebaseConfig = {
    apiKey: "AIzaSyAH0N3w1_8COd8y4aBYHe2Af7xNUivJnS0",
    authDomain: "idiole-af2fe.firebaseapp.com",
    databaseURL: "https://idiole-af2fe-default-rtdb.firebaseio.com",
    projectId: "idiole-af2fe",
    storageBucket: "idiole-af2fe.appspot.com",
    messagingSenderId: "721176860744",
    appId: "1:721176860744:web:eedef10b737a584219607d"
  };
  
  firebase.initializeApp(firebaseConfig); 
  database = firebase.database();
  //============================//
}
function setup()
{ 
  // colors['text_almost_right'] = color(random(0,255), random(0,255), random(0,255))
  //render options (p5.js native)
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  imageMode(CENTER)

  //setup screen-space dimensions
  createCanvas(windowWidth, windowHeight);
  
  render_options['font_size_multiplier'] = 0.00078125 * width
  
  //setup the firebase variables
  configure_firebase()

  //load dictionary from text file
  load_dictionary()

  //create and set all the elements of each screen
  create_screens()

  //generate creative, funny, and authentic and usually unique username for the user
  generate_username()

  //switch screen to menu screen
  switch_screen('menu')
}
function draw()
{
  background(colors['background']);
  
  screen[current_screen].render()

  if(current_screen == 'game'){game_loop()}
}
function game_loop()
{
  if(!game_stats['won'] && game_stats_elements['timer_element'].qualities['second'] != second() && game_stats['attempts'] > 0)
  {
    game_stats['time'] += 1

    let time_minute = floor(game_stats['time'] / 60)
    let time_second = game_stats['time'] - (time_minute * 60)

    let formatted_time = nf(time_minute, 2,0) + ":" + nf(time_second, 2, 0)

    game_stats_elements['timer_element'].set_text(formatted_time)
    game_stats_elements['timer_element'].set_quality('second', second())
  }
  else if(game_stats['won'] || game_stats['attempts'] == 0)
  {
    let desired_vector = createVector(1, 0.35)
    let difference_vector = p5.Vector.sub(desired_vector, screen['game'].children['game_board'].sz)
    difference_vector.div(10)

    screen['game'].children['game_board'].sz = p5.Vector.add(screen['game'].children['game_board'].sz, difference_vector)

    screen['game'].children['game_board'].ssz = p5.Vector.mult(screen['game'].ssz, screen['game'].children['game_board'].sz)
  }
}
function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function retrieve_leaderboard_content()
{
  let ref = await database.ref(get_score_seed() + '/')
  let database_values = []

  ref.orderByChild('score').on("value", function (snapshot) {
      snapshot.forEach(function(child) {
          database_values.push(child.val())  
      });
  }, 
  function (errorObject)
  {
      print('error')
  });

  return database_values
}
async function update_leaderboard_elements()
{
  database_values = await retrieve_leaderboard_content()

  database_values.reverse()

  let leaderboard_vals = database_values.slice(0,4)

  let user_in_leaderboard = false

  for(val in leaderboard_vals)
  {
    if(leaderboard_vals[val]['username'] == game_stats['username']) user_in_leaderboard = true
  }

  await sleep(200)

  //check if user is in top 4, if not, 4th spot make it nth spot and give it to user
  for(let i = 0; i < 4; i++)
  {
    let reference_name;
    if(i % 2 == 0){reference_name = 'first_third_leaderboard_element'}
    else{reference_name = 'second_fourth_leaderboard_element'}

    let username_elem = screen['game'].children['leaderboard_element'].children[reference_name].children['leaderboard_' + i].children['leaderboard_username_element_' + i]
    let score_elem = screen['game'].children['leaderboard_element'].children[reference_name].children['leaderboard_' + i].children['leaderboard_score_element_' + i]
    let place_elem = screen['game'].children['leaderboard_element'].children[reference_name].children['leaderboard_' + i].children['leaderboard_place_element_' + i]

    //
    if(leaderboard_vals.length <= i)
    {
      username_elem.set_text('[  ]')
      place_elem.set_text((i+1) + '.')
      score_elem.set_text(0)
      //
      username_elem.shake(10)
      score_elem.shake(10)
      place_elem.shake(10)
      //
    }
    else
    {
      //
      if(leaderboard_vals[i]['username'] == game_stats['username'])
      {
        username_elem.set_text(game_stats['username'] +  ' (you)')
      }
      else
      {
        username_elem.set_text(leaderboard_vals[i]['username'])
      }

      username_elem.set_quality('text_color', color(
        leaderboard_vals[i]['username_color']['levels'][0],
        leaderboard_vals[i]['username_color']['levels'][1],
        leaderboard_vals[i]['username_color']['levels'][2],
      ))

      score_elem.set_text(leaderboard_vals[i]['score'])
      place_elem.set_text((i+1) + '.')
      //
      username_elem.shake(10)
      score_elem.shake(10)
      place_elem.shake(10)
    }
  }
  if(!user_in_leaderboard)
  {
    let reference_name = 'second_fourth_leaderboard_element'
    let username_elem = screen['game'].children['leaderboard_element'].children[reference_name].children['leaderboard_3'].children['leaderboard_username_element_3']
    let score_elem = screen['game'].children['leaderboard_element'].children[reference_name].children['leaderboard_3'].children['leaderboard_score_element_3']
    let place_elem = screen['game'].children['leaderboard_element'].children[reference_name].children['leaderboard_3'].children['leaderboard_place_element_3']
    username_elem.set_quality('text_color', game_stats['username_color'])
    username_elem.set_text('Your Score')

    score_elem.set_text(game_stats['score'])

    place_elem.set_text('NA')
  }
}
function upload_score()
{
  game_stats['score'] = game_stats['attempts'] * 1000 - 10 * game_stats['time']
  //
  let current_seed = get_score_seed()

  database.ref(str(current_seed) + '/').push({
    username: game_stats['username'],
    score: game_stats['score'],
    username_color : game_stats['username_color']
  })
}
async function display_end_game_stats()
{
  screen['game'].children['keyboard'].show(false)
  screen['game'].children['keyboard'].ssz = createVector(0,0)

  let leaderboard_element = new canvas_column(
    pos = createVector(0,0),
    sz = createVector(0.92, 0.4),
    parent = screen['game'],
    alignment = {
      vertical: 'top',
      horizontal: 'center'
    }
  )
  screen['game'].add_child(leaderboard_element, 'leaderboard_element')

  let leaderboard_text_element = new canvas_element(
    pos = createVector(0,0),  
    sz = createVector(0.2, 0.15),
    parent = leaderboard_element,
    qualities = {
      text: 'Leaderboard',
      text_color: colors['text_normal'],
      text_size: 38,
      text_font: fonts['title_font'],
      shadow: createVector(5, 5),
      underlined: true,
      underline_color: colors['text_right']
    }
  )
  
  let refresh_leaderboard_button = new canvas_element(
    pos = createVector(0,0),  
    sz = createVector(0.2, 0.08),
    parent = leaderboard_element,
    qualities = {
      text: 'refresh',
      text_color: colors['text_inactive'],
      text_size: 15,
      text_font: fonts['coolvetica_italics'],
      shadow: createVector(2, 2),
      hover_position: createVector(-3,-3),
      hover_text_color: colors['text_almost_right']
    },
    on_click = (self) => {
      self.shake(10)
      update_leaderboard_elements()
    },
    root_screen = 'game'
  )

  clickable_objects['refresh_leaderboard_button'] = refresh_leaderboard_button

  leaderboard_element.add_child(leaderboard_text_element, 'leaderboard_text_element')
  leaderboard_element.add_child(refresh_leaderboard_button, 'refresh_leaderboard_button')

  let first_third_leaderboard_element = new canvas_row(
    pos = createVector(0,0),
    sz = createVector(0.9, 0.4),
    parent = leaderboard_element,
    alignment={horizontal:'center', vertical:'center'},
    padding=0.06,
  )
  leaderboard_element.add_child(first_third_leaderboard_element, 'first_third_leaderboard_element')

  let second_fourth_leaderboard_element = new canvas_row(
    pos = createVector(0,0),
    sz = createVector(0.9, 0.4),
    parent = leaderboard_element,
    alignment={horizontal:'center', vertical:'center'},
    padding=0.06,
  )
  leaderboard_element.add_child(second_fourth_leaderboard_element, 'second_fourth_leaderboard_element')

  for(let i = 0; i < 4; i++)
  {
    let current_leaderboard_element = new canvas_row(
      pos = createVector(0,0),
      sz = createVector(0.5,0.5),
      parent = leaderboard_element
    )

    if(i % 2 == 0){first_third_leaderboard_element.add_child(current_leaderboard_element, 'leaderboard_' + i)}
    else{second_fourth_leaderboard_element.add_child(current_leaderboard_element, 'leaderboard_' + i)}

    let leaderboard_place_element = new canvas_element(
      pos = createVector(0,0),
      sz = createVector(0.1,1),
      parent = current_leaderboard_element,
      qualities = {
        text: (i+1) + '.',
        text_color: colors['text_normal'],
        text_size: 30,
        text_font: fonts['regular_font'],

        fill_color: colors['background_right'],
        outline_color: colors['text_normal'],
        image: images['stripe_pattern'],
        image_tint: color(200,200,200,80),
      }
    )

    let leaderboard_username_element = new canvas_element(
      pos = createVector(0,0),
      sz = createVector(0.75,1),
      parent = current_leaderboard_element,
      qualities = {
        text: '[  ]',
        text_color: color(random(0,255), random(0,255), random(0,255)),
        text_size: 28,
        text_font: fonts['regular_font'],
        shadow: createVector(5,5),
      }
    )

    let leaderboard_score_element = new canvas_element(
      pos = createVector(0,0),
      sz = createVector(0.15,1),
      parent = current_leaderboard_element,
      qualities = {
        text: '0',
        text_color: colors['text_normal'],
        text_size: 30,
        text_font: fonts['regular_font'],
        shadow: createVector(5,5)
      }
    )

    current_leaderboard_element.add_child(leaderboard_place_element, 'leaderboard_place_element_' + i)
    current_leaderboard_element.add_child(leaderboard_username_element, 'leaderboard_username_element_' + i)
    current_leaderboard_element.add_child(leaderboard_score_element, 'leaderboard_score_element_' + i)
  }

  // update_leaderboard_elements()
  await sleep(500)
  update_leaderboard_elements()
}
function create_screens()
{
  screen['menu'] = new canvas_column(
    pos = createVector(width / 2, height / 2),
    sz = createVector(1.0, 1.0),
    null,
    alignment = {
      vertical: 'top',
      horizontal: 'center'
    }
  )

  screen['game'] = new canvas_column(
    pos = createVector(width / 2, height / 2),
    sz = createVector(1.0, 1.0),
    null,
    alignment = {
      vertical: 'top',
      horizontal: 'center'
    }
  )

  screen['leaderboard'] = new canvas_column(
    pos = createVector(width / 2, height / 2),
    sz = createVector(1.0, 1.0),
    null,
    alignment = {
      vertical: 'top',
      horizontal: 'center'
    }
  )

  screen['tutorial'] = new canvas_column(
    pos = createVector(width / 2, height / 2),
    sz = createVector(1.0, 1.0),
    null,
    alignment = {
      vertical: 'top',
      horizontal: 'center',
    }
  )

  create_screen_menu()
  create_screen_game()
  create_screen_tutorial()
  // create_screen_leaderboard()
}
function create_screen_tutorial()
{
  let tutorial_image = new canvas_element(
    pos = createVector(0,0),
    sz = createVector(0.4, 0.8),
    parent = screen['tutorial'],
    qualities = {
      image: images['tutorial_image'],
      maintain_image_aspect_ratio: true
    }
  )

  let back_to_menu_button = new canvas_element(
    pos = createVector(0,0),
    sz = createVector(0.3, 0.1),
    parent = screen['tutorial'],
    qualities = {
      text: '[ Menu ]',
      text_color: colors['text_normal'],
      text_font: fonts['title_font'],
      text_size: 34,
      //
      hover_text_color: colors['text_almost_right'],
      shadow: createVector(5,5),
      hover_position: createVector(-5,-5),
    },
    on_click = (self) => {
      switch_screen('menu')
    },
    root_screen = 'tutorial'
  )

  clickable_objects['tutorial_back_to_menu'] = back_to_menu_button

  screen['tutorial'].add_child(tutorial_image, 'tutorial_image')
  screen['tutorial'].add_child(back_to_menu_button)
}
function create_screen_menu()
{
  //using this for vertical spacing only
  let dimensions = {
    banner: createVector(1, 0.2),
    play_button: createVector(.2, 0.1),
    tutorial_button: createVector(.3, 0.1),
    leaderboard_button: createVector(.3, 0.1),
    randomize_username_button: createVector(.3, 0.1),
    username_display: createVector(1, 0.2),
  }

  //Top of the page banner
  menu_banner = new canvas_column(
    pos = createVector(0,0),
    sz = dimensions['banner'],
    parent = screen['menu'],
    alignment = {
      vertical: 'top',
      horizontal: 'center'
    }
  )

  screen['menu'].add_child(menu_banner, 'menu_banner')

  //Idiole title
  let banner_text = new canvas_element(
    pos = createVector(0,0),  
    sz = createVector(0.25, 0.5),
    parent = menu_banner,
    qualities = {
      text: 'Idiole',
      text_color: colors['text_normal'],
      text_size: 42,
      text_font: fonts['title_font'],
      shadow: createVector(5, 5),
    }
  )
  
  //Author title
  let banner_subtext = new canvas_element(
    pos = createVector(0,0),
    sz = createVector(0.25, 0.25),
    parent = menu_banner,
    qualities = {
      text: 'a game by rowan mcnitt',
      text_color: colors['text_inactive'],
      text_size: 20,
      text_font: fonts['coolvetica_italics']
    }
  )

  //Inspiration name
  let banner_subtext_ext = new canvas_element(
    pos = createVector(0,0),
    sz = createVector(0.25, 0.15),
    parent = menu_banner,
    qualities = {
      text: "inspired by the NYT's Wordle",
      text_color: colors['unfilled_text'],
      text_size: 15,
      text_font: fonts['coolvetica_italics']
    }
  )
  
  menu_banner.add_child(banner_text, 'banner_text')
  menu_banner.add_child(banner_subtext, 'banner_subtext')
  menu_banner.add_child(banner_subtext_ext, 'banner_subtext_ext')


  // Main Menu Buttons 
  /////////////////////////////////////////////

  let play_button = new canvas_element(
    pos = createVector(0,0),
    sz = dimensions['play_button'],
    parent = menu_banner,
    qualities = {
      text: "[  Play  ]",
      text_color: colors['text_normal'],
      text_size: 44,
      text_font: fonts['title_font'],
      shadow: createVector(5, 5),
      hover_position: createVector(-5, -5),
      hover_text_color: colors['text_almost_right'],
    },
    on_click = () => {
      begin_game()
    },
    root_screen = 'menu'
  )

  screen['menu'].add_child(play_button, 'play_button')
  clickable_objects['play_button'] = play_button

  let leaderboard_button = new canvas_element(
    pos = createVector(0,0),
    sz = dimensions['leaderboard_button'],
    parent = menu_banner,
    qualities = {
      text: "[  Leaderboard  ]",
      text_color: colors['text_normal'],
      text_size: 40,
      text_font: fonts['title_font'],
      shadow: createVector(5, 5),
      hover_position: createVector(-5, -5),
      hover_text_color: colors['text_almost_right'],
    },
    on_click = () => {
    },
    root_screen = 'menu'
  )

  let tutorial_button = new canvas_element(
    pos = createVector(0,0),
    sz = dimensions['tutorial_button'],
    parent = menu_banner,
    qualities = {
      text: "[  Tutorial  ]",
      text_color: colors['text_normal'],
      text_size: 44,
      text_font: fonts['title_font'],
      shadow: createVector(5, 5),
      hover_position: createVector(-5, -5),
      hover_text_color: colors['text_almost_right'],
    },
    on_click = async (self) => {
      await sleep(20)
      switch_screen('tutorial')
    },
    root_screen = 'menu'
  )
  screen['menu'].add_child(tutorial_button, 'tutorial_button')
  clickable_objects['tutorial_button'] = tutorial_button

  ////////////////////////////////////////////

  let username_row_element = new canvas_row(
    pos = createVector(0,0),
    sz = dimensions['username_display']
  )
  screen['menu'].add_child(username_row_element, 'username_row')

  let username_row_static_text = new canvas_element(
    pos = createVector(0,0),
    sz = createVector(0.18, 0.25),
    parent = menu_banner,
    qualities = {
      text: 'username: ',
      text_color: colors['text_inactive'],
      text_size: 26,
      text_font: fonts['coolvetica_italics']
    }
  )

  let username_row_display = new canvas_element (
    pos = createVector(0,0),
    sz = createVector(0.18, 0.25),
    parent = menu_banner,
    qualities = {
      text: '[ test_username_11 ]',
      text_color: color(random(0,255), random(0,255), random(0,255)),
      text_size: 26,
      text_font: fonts['coolvetica_italics'],
      shadow: createVector(5, 5),
      hover_position: createVector(-5, -5),
      hover_text_color: color(random(0,255), random(0,255), random(0,255)),
    },
    this.on_click = (elem) => {
      generate_username()
      elem.shake(10)
    },
    root_screen = 'menu'
  )

  username_row_element.add_child(username_row_static_text, 'username_static_text')
  username_row_element.add_child(username_row_display, 'username_row_display')

  clickable_objects['username_row_display'] = username_row_display
  
  //IMPORTANT
  game_stats_elements['username_element'] = username_row_display
  //
}
function create_screen_game()
{
  let dimensions = {
    banner: createVector(1, 0.1),
    game_board: createVector(.8, 0.55),
    keyboard: createVector(.6, 0.35),
  }
  
  /// Game Banner //////////////////////////////
  game_banner = new canvas_row(
    pos = createVector(0,0),
    sz = dimensions['banner'],
    parent = screen['game'],
  )
  screen['game'].add_child(game_banner, 'game_banner')

  //////////////// attempts element //////////////////
  let attempts_element = new canvas_row(
    pos = createVector(0,0),
    sz = createVector(0.1, .4),
    parent = game_banner,
  )
  game_banner.add_child(attempts_element, 'attempts_element')


  let attempts_visual_element = new canvas_element(
    pos = createVector(0,0),
    sz = createVector(0.25, 1),
    parent = attempts_element,
    qualities = {
      image: images['retry'],
      image_tint: colors['text_almost_right'],
      maintain_image_aspect_ratio: true
    }
  )

  let attempts_text_element = new canvas_element(
    pos = createVector(0,0),
    sz = createVector(0.75,1),
    parent = attempts_element,
    qualities = {
      text: '8',
      text_color: colors['text_normal'],
      text_size: 30,
      text_font: fonts['regular_font']
    }
  )

  attempts_element.add_child(attempts_visual_element, 'attempts_visual')
  attempts_element.add_child(attempts_text_element, 'attempts_text')

  game_stats_elements['attempts_element'] = attempts_text_element


  //////////////// banner element //////////////////
  let banner_text = new canvas_element(
    pos = createVector(0,0),  
    sz = createVector(0.28, 1),
    parent = game_banner,
    qualities = {
      text: 'Idiole',
      text_color: colors['text_normal'],
      text_size: 62,
      text_font: fonts['title_font'],
      shadow: createVector(5, 5),
    }
  )
  game_banner.add_child(banner_text, 'banner_text')

  //////////////// timer element //////////////////
  let timer_element = new canvas_row(
    pos = createVector(0,0),
    sz = createVector(0.1, .4),
    parent = game_banner,
  )
  game_banner.add_child(timer_element, 'timer_element')


  let timer_visual_element = new canvas_element(
    pos = createVector(0,0),
    sz = createVector(0.25, 1),
    parent = timer_element,
    qualities = {
      image: images['timer'],
      image_tint: colors['text_almost_right'],
      maintain_image_aspect_ratio: true
    }
  )

  let timer_text_element = new canvas_element(
    pos = createVector(0,0),
    sz = createVector(0.75,1),
    parent = timer_element,
    qualities = {
      text: '11:11',
      text_color: colors['text_normal'],
      text_size: 30,
      text_font: fonts['regular_font']
    }
  )

  timer_element.add_child(timer_visual_element, 'timer_visual')
  timer_element.add_child(timer_text_element, 'timer_text')

  game_stats_elements['timer_element'] = timer_text_element


  ////////// Game Board /////////////////
  let game_board = new canvas_column(
    pos = createVector(0,0),
    sz = dimensions['game_board'],
    parent = screen['game'],
    alignment={horizontal:'center', vertical:'center'},
    padding = 0.05
  )
  screen['game'].add_child(game_board, 'game_board')


  ///////// Keyboard /////////////////
  let keyboard = new canvas_column(
    pos = createVector(0,0),
    sz = dimensions['keyboard'],
    parent = screen['game'],
    alignment={horizontal:'center',vertical:'center'},
    padding=0.035
  )
  screen['game'].add_child(keyboard, 'keyboard')
  
  // function setup_keyboard()

  let keyboard_rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['back', 'z', 'x' , 'c', 'v', 'b', 'n', 'm', 'enter']
  ]
  
  let row_element_height = 1 / (keyboard_rows.length+1.8)
  let button_element_width = 1 / 10
  
  for(row in keyboard_rows)
    {
      let new_row = new canvas_row(
          pos = createVector(0,0),
          size = createVector(dimensions['keyboard'].x, row_element_height),
          parent = keyboard,
          alignment={horizontal:'center',vertical:'center'},
          padding=0.026
      )

      keyboard.add_child(new_row, 'keyboard_row_' + row)
      
      for(_key in keyboard_rows[row])
        {
          current_key = keyboard_rows[row][_key]
          current_key_width = (current_key.length) * 0.032
          
          keyboard_button_element = new canvas_element(
            pos = createVector(0,0),
            sz =  createVector(button_element_width + current_key_width, 1),
            parent = new_row,
            qualities = {
              text: current_key.toUpperCase(),
              text_size: 26,
              text_font: fonts['regular_font'],
              text_color: colors['text_normal'],
              fill_color: colors['background'],
              outline_color: colors['text_almost_right'],
              shadow: createVector(4,6),
              stroke_size: 4.5,

              //hover qualities
              hover_position: createVector(-4, -4),
              hover_text_color: colors['background'],
              hover_outlined_color: colors['text_almost_right'],
              hover_fill_color: colors['text_almost_right'],

              //unique to this element
              keyboard_key: current_key,
            },
            on_click = (self) =>{
              self.shake(5)
              process_key(self.qualities['keyboard_key'])
            },
            root_screen = 'game',
          )
          
          new_row.add_child(keyboard_button_element)
          clickable_objects['keyboard_button_' + current_key] = keyboard_button_element
        }
    }
}
function setup_gameboard(chosen_idiom)
{
  //16 characters (including spaces) per line
  let max_char = 16
  
  idiom_words = chosen_idiom.split(' ')
  gameboard_rows = [{included_indices: [], text: ''}]
  

  //todo: fix this later
  character_height = 1/4
  character_width = 1/17

  //overcomplicated as shit -- used so dont have to add up lengths every time
  let current_row = 0
  for(let i = 0; i < idiom_words.length; i++)
    {
      if(gameboard_rows[current_row]['text'].length + idiom_words[i].length <= max_char)
        {
          gameboard_rows[current_row]['text'] += (idiom_words[i] + ' ')
          gameboard_rows[current_row]['included_indices'].push(i)
        }
      else
        {
          let new_row = {
            included_indices: [i],
            text: idiom_words[i] + ' ',
          }
          gameboard_rows.push(new_row)
          current_row += 1
        }
    }

  for(let row_index = 0; row_index < gameboard_rows.length; row_index++)
    {
      let current_row = gameboard_rows[row_index]

      let new_row = new canvas_row(
        pos = createVector(0,0),
        sz = createVector(1, character_height),
        parent = screen['game'].children['game_board']
      )

      screen['game'].children['game_board'].add_child(new_row, 'game_board_row_' + row_index)

      for(let word_index = 0; word_index < current_row['included_indices'].length; word_index++)
      {
        let current_word = idiom_words[current_row['included_indices'][word_index]]
        let current_word_index = current_row['included_indices'][word_index]

        for(let char_index = 0; char_index < current_word.length; char_index++)
        {
          let current_char = current_word[char_index]

          let current_gameboard_element = new canvas_element(
            pos = createVector(0,0),
            sz = createVector(character_width, 1),
            parent = new_row,
            qualities = {
              text: '',
              text_size: 32,
              text_font: fonts['regular_font'],
              text_color: colors['text_normal'],
              fill_color: colors['background'],
              outline_color: colors['unfilled_text'],
              stroke_size: 3,
              shake_amount: createVector(0.4, 1.6),
            }
          )

          new_row.add_child(current_gameboard_element, 'element_' + word_index + '_' + char_index)
          idiom_structs['letter_elements'][createVector(current_word_index, char_index)] = current_gameboard_element
        }
        
        //add a blank after every word
        if(word_index != current_row['included_indices'].length - 1)
        {
          let blank_element = new canvas_element(
            pos = createVector(0,0),
            sz = createVector(character_width/1.5, character_height),
            parent = new_row,
            qualities = {
              fill_color: colors['background']
            }
          )
          new_row.add_child(blank_element, 'element_' + word_index + '_blank')
        }
      }
    }
}
function keyPressed()
{
  process_key(key)
}
function process_key(_key)
{
  if('keyboard_button_' + _key in clickable_objects && clickable_objects['keyboard_button_' + _key].qualities['disabled']){return}
  function check_in_bounds(vec)
  {
    return(vec.x < idiom_structs['word_array'].length && vec.y < idiom_structs['word_array'][vec.x].length && vec.x >= 0 && vec.y >= 0)
  }
  function increment_index(old_index)
  {
    let index = createVector(old_index.x, old_index.y)
    if(index.y == word_array[index.x].length - 1){index.x +=1; index.y = 0}
    else{index.y += 1}
    return index
  }
  function decrement_index(old_index)
  {
    let index = createVector(old_index.x, old_index.y)
    if(index.y <= 0){index.x -= 1; index.y = word_array[index.x].length - 1}
    else{index.y -= 1}
    return index
  }
  _key = _key.toLowerCase() 
  if(122 - unchar(_key) <= 25) //normal text characters
  {
    index = game_stats['game_space_index']
    word_array = idiom_structs['word_array']

    while(idiom_structs['letter_elements'][index].get_text() != '' || idiom_structs['guessed_dict'][index] == 1)
    {
      index = increment_index(index)
      
      if(!check_in_bounds(index)){return}

      game_stats['game_space_index'] = index
    }

    // Set the letter element to 'filled' - normal
    idiom_structs['letter_elements'][index].set_text(_key.toUpperCase())
    idiom_structs['letter_elements'][index].set_quality('outline_color', colors['text_normal'])
    idiom_structs['letter_elements'][index].shake(8)

  }
  else if(_key.substring(0,4) == 'back')
  {
    index = game_stats['game_space_index']
    word_array = idiom_structs['word_array']

    while(idiom_structs['letter_elements'][index].get_text() == '' || idiom_structs['guessed_dict'][index] == 1)
    {
      if(index.y == 0 && index.x == 0){return}
      
      index = decrement_index(index)
      
      if(!check_in_bounds(index)){return}

      game_stats['game_space_index'] = index
    }

    for(underlined_index = 0; underlined_index <  idiom_structs['underlined_words'].length; underlined_index++)
    {
      idiom_structs['underlined_words'][underlined_index].set_quality('underlined', undefined)
    }
    idiom_structs['underlined_words'] = []

    idiom_structs['letter_elements'][index].set_text('')
    idiom_structs['letter_elements'][index].set_quality('outline_color', colors['unfilled_text'])
    idiom_structs['letter_elements'][index].shake(8)
  }
  else if(_key == 'enter')
  {
    if(game_stats['attempts'] < 1 || game_stats['won']) return
    //check if words are correct
    constructed_words = []
    constructed_words_elements = []
    incorrect_words = []
    //
    for(word_index = 0; word_index < idiom_structs['word_array'].length; word_index++)
    {
      let current_correct_word = idiom_structs['word_array'][word_index]
      let constructed_word_elements = []
      let constructed_word = ''

      for(char_index = 0; char_index < current_correct_word.length; char_index++)
      {
        let current_correct_letter = current_correct_word[char_index]
        let current_letter_element = idiom_structs['letter_elements'][createVector(word_index, char_index)]
        //
        if(current_letter_element.get_text() == ''){return}
        //
        constructed_word += current_letter_element.get_text()
        constructed_word_elements.push(current_letter_element)
      }
      if(idiom_dictionary[constructed_word.toLowerCase()] == undefined){incorrect_words.push(constructed_word_elements)}
      constructed_words.push(constructed_word)
      constructed_word
      _elements.push(constructed_word_elements)
    }

    if(incorrect_words.length > 0)
    {
      for(word_index = 0; word_index < incorrect_words.length; word_index++)
      {
        let current_word = incorrect_words[word_index]
        for(letter_index = 0; letter_index < current_word.length; letter_index++)
        {
          let current_letter_element = current_word[letter_index]

          idiom_structs['underlined_words'].push(current_letter_element)

          current_letter_element.set_quality('underlined', colors['text_wrong'])
          current_letter_element.set_quality('underline_color', colors['text_wrong'])

          current_letter_element.shake(15)
        }
      }
      return
    }

    let all_correct = true
    for(word_index = 0; word_index < constructed_words.length; word_index++)
    {
      let current_correct_word = idiom_structs['word_array'][word_index]
      for(char_index = 0; char_index < constructed_words[word_index].length; char_index++)
      {
        let current_correct_letter = current_correct_word[char_index]
        let current_letter_element = idiom_structs['letter_elements'][createVector(word_index, char_index)]
        let current_letter = current_letter_element.get_text().toLowerCase()

        if(current_letter == current_correct_letter && idiom_structs['guessed_dict'][createVector(word_index, char_index)] != 1)
        {          
          idiom_structs['letter_counts'][current_letter] -= 1
          idiom_structs['guessed_dict'][createVector(word_index, char_index)] = 1

          current_letter_element.shake(10)
          current_letter_element.set_quality('shadow', createVector(10, 10)),
          current_letter_element.set_quality('image', images['stripe_pattern'])
          current_letter_element.set_quality('image_tint', color(100,220,100,100))
          current_letter_element.set_quality('fill_color', colors['background_right'])
          current_letter_element.set_quality('outline_color', colors['text_right'])
        }
        else if(current_letter != current_correct_letter)
        {
          all_correct = false
          current_letter_element.shake(10)
        }
        update_letter(current_letter)
      }
    }
    game_stats['won'] = all_correct
    all_correct && upload_score()
    all_correct && display_end_game_stats()
    all_correct && update_leaderboard_elements()
    !all_correct && (game_stats['attempts'] -= 1, game_stats_elements['attempts_element'].set_text(game_stats['attempts']), game_stats_elements['attempts_element'].shake(20))
    
    if(!all_correct && game_stats['attempts'] == 0)
    {
      for(word_index = 0; word_index < idiom_structs['word_array'].length; word_index++)
      {
        let current_word = idiom_structs['word_array'][word_index]
        for(char_index = 0; char_index < current_word.length; char_index++)
        {
          let current_letter_element = idiom_structs['letter_elements'][createVector(word_index, char_index)]

          if(current_letter_element.get_text().toLowerCase() != idiom_structs['word_array'][word_index][char_index])
          {
            current_letter_element.set_text(idiom_structs['word_array'][word_index][char_index].toUpperCase())
            current_letter_element.set_quality('outline_color', colors['text_wrong'])
          }
        }
      }
      display_end_game_stats()
      update_leaderboard_elements()
    }
  }
}
function update_letter(letter)
{
  let letter_element = clickable_objects['keyboard_button_' + letter]
  
  
  if(idiom_structs['letter_counts'][letter] != undefined)
  {
    // if letter is in the answer but the count is 0
    if(idiom_structs['letter_counts'][letter] <= 0)
    {
      letter_element.set_quality('hover_position', undefined)
      letter_element.set_quality('hover_text_color', undefined)
      letter_element.set_quality('hover_outlined_color', undefined)
      letter_element.set_quality('hover_fill_color', undefined)


      letter_element.set_quality('fill_color', colors['background_right'])
      letter_element.set_quality('outline_color', colors['text_right'])
      letter_element.set_quality('text_color', colors['text_right'])

      letter_element.set_quality('disabled', true)
    }
    // if letter is in in the answer and the count > 0
    else
    {
      letter_element.set_quality('fill_color', color(44,44,20))
      letter_element.set_quality('outline_color', color(240,240,100))
      letter_element.set_quality('text_color', color(240,240,100))

      letter_element.set_quality('hover_text_color', color(44,44,20))
      letter_element.set_quality('hover_outlined_color', color(240,240,100))
      letter_element.set_quality('hover_fill_color', color(240,240,100))
    }
  }
  else // if letter is not in the answer
  {
    letter_element.set_quality('hover_position', undefined)
    letter_element.set_quality('hover_text_color', undefined)
    letter_element.set_quality('hover_outlined_color', undefined)
    letter_element.set_quality('hover_fill_color', undefined)
    
    letter_element.set_quality('fill_color', colors['background'])
    letter_element.set_quality('outline_color', colors['text_inactive'])
    letter_element.set_quality('text_color', colors['text_inactive'])

    letter_element.set_quality('disabled', true)
  }
  
  
}
function begin_game()
{
  //wipe previous stats -- except username
  game_stats['game_space_index'] = createVector(0, 0)
  load_idiomes()
  switch_screen('game')
}
function load_idiomes()
{
  loadStrings('assets/resources/idiom_list_adjusted.txt', initialize_idiom_structs);
}
function initialize_idiom_structs(result)
{
  let idiom_length = result.length

  //see get_score_seed for details
  let random_seed = get_score_seed()
  randomSeed(random_seed)
  //
  let chosen_index = int(random(0,idiom_length))
  //
  let idiom = result[chosen_index]
  //
  let split_words = idiom.split(' ')
  
  let word_array = []
  let letter_counts = {}
  for(let word_index = 0; word_index < split_words.length; word_index++)
  {
    let letter_array = []
    for(let letter_index = 0; letter_index < split_words[word_index].length; letter_index++)
    {
      let current_letter = split_words[word_index][letter_index]
      
      //keep track of how many of each type of letter are in the answer
      letter_counts[current_letter] == undefined ? letter_counts[current_letter] = 1 : letter_counts[current_letter] += 1
      letter_array.push(current_letter)
    }
    word_array.push(letter_array)
  }

  idiom_structs['word_array'] = word_array
  idiom_structs['letter_counts'] = letter_counts
  setup_gameboard(idiom)
}
function switch_screen(new_screen)
{
  print(new_screen)
  current_screen = new_screen
}
function generate_username()
{
  let random_animal = nouns[int(random(0,nouns.length))]
  let random_adjective = adjectives[int(random(0,adjectives.length))]
  let random_number = (int(random(0,999)))
  if(int(random(0,9)) == 2){random_number = ''}

  let random_name = (random_adjective + '_' + random_animal + random_number ).toLowerCase()
  let random_color = color(random(0,255), random(0,255), random(0,255))

  game_stats['username'] = random_name
  game_stats['username_color'] = random_color

  game_stats_elements['username_element'].set_text('[ ' + random_name + ' ]')
  game_stats_elements['username_element'].qualities['text_color'] = random_color
  game_stats_elements['username_element'].qualities['hover_text_color'] = color(random(0,255),random(0,255),random(0,255))
}
function get_score_seed()
{
  return (day()*49 + month()*1519 + hour())
}
function mousePressed()
{
  for(obj in clickable_objects)
  { 
    clickable_objects[obj].get_hovered() && clickable_objects[obj].root_screen == current_screen && clickable_objects[obj].on_click(clickable_objects[obj])
  }
}
function mouse_is_over(element)
{
  return(mouseX >= element.pos.x - element.ssz.x / 2 &&
    mouseX <= element.pos.x + element.ssz.x / 2 &&
    mouseY >= element.pos.y - element.ssz.y / 2 &&
    mouseY <= element.pos.y + element.ssz.y / 2)
}
function load_dictionary()
{
  loadStrings('assets/resources/idiom_dictionary.txt', initialize_dictionary);
}
function initialize_dictionary(result)
{
  for(res in result)
    {
      idiom_dictionary[result[res]] = 1
    }
}
class canvas_element
{
  constructor(pos, sz, parent, qualities = {}, on_click = null, root_screen=null, on_hover = () => {}, shown = true)
  {
    //position
    this.pos = pos
    
    // vector of percentages of 'used' size (40%, 80%)
    this.sz = sz

    // 'screen-space' size (actual size in pixels)
    this.ssz;

    if(parent == null){this.ssz = p5.Vector.mult(this.sz, createVector(width, height))}

    // parent canvas element
    this.parent = parent

    // parent's parent's parent lol
    this.root_screen = root_screen

    // 'text_color', 'fill_color', 'stroke_color' 
    this.qualities = qualities

    // vector of percentages of 'used' internal size -- used to calculate where children get placed
    this.internal_sz = createVector(0,0)

    //keep track of children by name
    this.children = {}

    //keep trackc of children by insertion order
    this.ordered_children = []

    this.num_children = 0

    // mouse functions
    this.on_click = on_click
  
    if(on_click == null){this.on_click = () => {}}

    this.on_hover = on_hover
    this.hovered = false

    // simple 'shaking' animation -- other animations will be expanded
    this.render_position = pos
    this.shake_amount = this.qualities['shake_amount'] == undefined ? createVector(0.5, 0.9) : this.qualities['shake_amount']
    this.shake_time = 0

    //show element
    this.shown = shown

  }
  show(val)
  {
    this.shown = val
  }
  add_child(child, name) //child is of type canvas element
  {
    this.children[name] = child
    this.ordered_children.push(child)
    this.internal_sz.add(child.sz)

    // set the childs screen space size to the percentage of its parents screen space size
    child.ssz = p5.Vector.mult(this.ssz, child.sz)

    this.num_children += 1
  }
  set_text(txt)
  {
    this.qualities['text'] = txt
  }
  get_text()
  {
    return this.qualities['text']
  }
  get_hovered()
  {
    return this.hovered
  }
  //change / add quality
  set_quality(quality_name, quality_value)
  {
    this.qualities[quality_name] = quality_value
  }
  set_pos(x, y)
  {
    this.pos = createVector(x, y)
  }
  get_x()
  {
    return this.pos.x
  }
  get_y()
  {
    return this.pos.y
  }
  shake(amnt)
  {
    this.shake_time = amnt
  }
  render()
  {
      if(this.shown == false){return}

      //debug mode
      if(render_options['display_boundaries_all']){strokeWeight(1);stroke(255);noFill();rect(this.pos.x,this.pos.y,this.ssz.x, this.ssz.y)}

      //check if mouse hovered
      mouse_is_over(this) ? (this.on_hover(self), this.hovered = true) : this.hovered = false;

      //(condition) ? true : false;

      this.shake_time > 0 ? (this.shake_time--,this.render_position=createVector(this.pos.x + this.shake_amount.x * random(-this.shake_time, this.shake_time),
      this.pos.y + this.shake_amount.y * random(-this.shake_time, this.shake_time))) : (this.render_position = this.pos)
      
      //hover position change
      if (this.hovered && this.qualities['hover_position'] != undefined) this.render_position.add(this.qualities['hover_position'])

      //underlined quality
      if(this.qualities['underlined'] != undefined)
      {
        //if theres a stroke color use it, else use the text color
        stroke(this.qualities['underline_color'])
        line(this.render_position.x - this.ssz.x / 2, this.render_position.y + this.ssz.y / 1.65,
        this.render_position.x + this.ssz.x / 2, this.render_position.y + this.ssz.y / 1.65)
      }

      // Outline / Rectangle Options
      //
      // outline_color (undefined if not outlined)
      // fill_color    (undefined if not filled)

      //outline / rectangular shadow
      if(this.qualities['shadow'] != undefined)
      {
        this.qualities['outline_color'] != undefined ? stroke(0,0,0,120) : noStroke()
        this.qualities['fill_color'] != undefined ? fill(0,0,0,120) : noFill()
        rect(this.render_position.x + this.qualities['shadow'].x, this.render_position.y +this.qualities['shadow'].y, this.ssz.x, this.ssz.y, render_options['bevel'])
      }

      this.qualities['outline_color'] != undefined ? stroke(this.qualities['outline_color']) : noStroke();
      this.qualities['fill_color'] != undefined ? fill(this.qualities['fill_color']) : noFill();

      if (this.hovered && this.qualities['hover_outlined_color'] != undefined)stroke(this.qualities['hover_outlined_color'])
      if (this.hovered && this.qualities['hover_fill_color'] != undefined) fill(this.qualities['hover_fill_color'])
      
      this.qualities['stroke_size'] != undefined && strokeWeight(this.qualities['stroke_size'])

      rect(this.render_position.x, this.render_position.y, this.ssz.x, this.ssz.y, render_options['bevel'])

      // Image Options
      //
      // image
      // image_tint (null if not tinted)

      this.qualities['image_tint'] != undefined ? tint(this.qualities['image_tint']) : noTint();
      if(this.qualities['image'] != undefined)
      {
        noStroke();
        let image_scale = createVector(this.ssz.x, this.ssz.y)
        if(this.qualities['maintain_image_aspect_ratio'] != undefined)
        {
          this.qualities['image'].width > this.qualities['image'].height ? image_scale = createVector(this.ssz.x, this.ssz.x * this.qualities['image'].height / this.qualities['image'].width) : image_scale = createVector(this.ssz.x * this.qualities['image'].width / this.qualities['image'].height, this.ssz.x)
        }
        image(this.qualities['image'], this.render_position.x, this.render_position.y, image_scale.x, image_scale.y)
      }
      
      // Text Options
      //
      // text       (undefined if no text)
      // text_color
      // text_size  
      // text_font
      if(this.qualities['text'] != undefined)
      {
        noStroke(); 
        textSize(this.qualities['text_size'] * render_options['font_size_multiplier'])
        textFont(this.qualities['text_font'])

        //text only has a shadow IF its rectangle has no fill)
        if(this.qualities['shadow'] != undefined && this.qualities['fill_color'] == undefined)
        {
          fill(0,0,0,120)
          text(this.qualities['text'], this.render_position.x + this.qualities['shadow'].x, this.render_position.y + this.qualities['shadow'].y)
        }
        
        this.hovered && this.qualities['hover_text_color'] != undefined ? fill(this.qualities['hover_text_color']) : fill(this.qualities['text_color']);

        text(this.qualities['text'], this.render_position.x, this.render_position.y)
      }
  }
}  
class canvas_column extends canvas_element
{
  constructor(pos, sz, parent, alignment={horizontal: 'center', vertical: 'center'}, padding = 0.02) // 2% padding as default
  {
    super(pos, sz, parent)

    this.alignment = alignment
    this.padding = padding
  }
  render()
  {
    if(this.shown == false){return}
    // debug option to view element boundaries
    if(render_options['display_boundaries'])
      {noFill();stroke(colors['text_almost_right']);rect(this.pos.x, this.pos.y, this.ssz.x, this.ssz.y)}
    
    // centered on vertical axis
    if(this.alignment['vertical'] == 'center')
      {
        // total percentage of screen space size used + total percentage of padding
        let total_height = this.internal_sz.y + (this.num_children - 1) * this.padding
        
        let current_y = this.pos.y - (total_height / 2) * (this.ssz.y)

        for(let child_index = 0; child_index < this.num_children; child_index++)
          {
            let child = this.ordered_children[child_index]
            current_y += child.ssz.y / 2
            child.set_pos(this.get_x(), current_y)
            child.render()

            current_y += child.ssz.y / 2 + (this.padding * this.ssz.y)
          }
      }
    else if(this.alignment['vertical'] == 'top')
    {
      let current_y = this.pos.y - (this.ssz.y / 2)
      
      for(let child_index = 0; child_index < this.num_children; child_index++)
      {
        let child = this.ordered_children[child_index]
        current_y += child.ssz.y / 2
        child.set_pos(this.get_x(), current_y)
        child.render()

        current_y += child.ssz.y / 2 + (this.padding * this.ssz.y)
      }
    }
    
    //top-down alignment
  }
}
class canvas_row extends canvas_element
{
  constructor(pos, sz, parent, alignment={horizontal: 'center', vertical: 'center'}, padding = 0.02) // 2% padding as default
  {
    super(pos, sz, parent)

    this.alignment = alignment
    this.padding = padding
  }
  render()
  {
    if(this.shown == false){return}
    // debug option to view element boundaries
    if(render_options['display_boundaries'])
      {noFill();stroke(colors['text_almost_right']);rect(this.pos.x, this.pos.y, this.ssz.x, this.ssz.y)}
    
    // centered on both axis
    if(this.alignment['horizontal'] == 'center')
      {
        // total percentage of screen space size used + total percentage of padding
        let total_width = this.internal_sz.x + (this.num_children - 1) * this.padding
        
        let current_x = this.pos.x - (total_width / 2) * (this.ssz.x)

        for(let child_index = 0; child_index < this.num_children; child_index++)
          {
            let child = this.ordered_children[child_index]
            current_x += child.ssz.x / 2
            child.set_pos(current_x, this.get_y())
            child.render()

            current_x += child.ssz.x / 2 + (this.padding * this.ssz.x)
          }
      }
  }
}
