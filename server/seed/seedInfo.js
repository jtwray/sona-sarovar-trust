const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/admin');
const HomePage = require('../models/homepage');
const TeamMember = require('../models/teammember');
const Project = require('../models/project');
const Activity = require('../models/activity');
const AboutUs = require('../models/aboutus');
const Testimonial = require('../models/testimonial');
const Award = require('../models/award');
const ncp = require('ncp').ncp;

const ObjectId = mongoose.Types.ObjectId;

const {INIT_ADMIN_USERNAME, INIT_ADMIN_PASSWORD, JWT_SECRET_KEY, RESOURCES_DIR} = process.env;

const INIT_ADMIN_ID = new ObjectId();
const INIT_ADMIN = {
  _id: INIT_ADMIN_ID,
  username: INIT_ADMIN_USERNAME,
  password: INIT_ADMIN_PASSWORD,
  tokens: [jwt.sign({_id: INIT_ADMIN_ID.toHexString()}, JWT_SECRET_KEY)]
};

const INIT_HOME_PAGE = {
  centerPics: [{
    _id: new ObjectId(),
    url: '/home/IMG1.jpg'
  }, {
    _id: new ObjectId(),
    url: '/home/IMG2.jpg'
  }],
  brandLogoUrl: '/home/logo.jpg',
  captions: [
    {text: '66% of street children in Mumbai never receive any education.'},
    {text: 'You can make a difference in their lives.'},
    {text: 'Come, join our hands in helping improve their lives.'}
  ]
};

const INIT_ABOUT_US = {
  vision: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
  'Nulla fermentum nisi sit amet odio tempor, vel fringilla metus porttitor. ' +
  'Curabitur eu efficitur elit. Ut consequat libero id varius aliquam. Nulla placerat viverra aliquet. ' +
  'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. ' +
  'Nunc vestibulum libero in nunc faucibus sagittis. In a ipsum leo. Cras auctor massa non euismod hendrerit. ' +
  'Ut viverra quam sit amet enim rutrum volutpat. Aenean hendrerit nulla ac urna dignissim posuere. ' +
  'Pellentesque non bibendum metus, vel tempor est. Pellentesque laoreet posuere enim, ac viverra nibh ' +
  'lacinia sit amet. Pellentesque sit amet rhoncus massa, ut maximus justo.',

  mission: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
  'Nulla fermentum nisi sit amet odio tempor, vel fringilla metus porttitor. ' +
  'Curabitur eu efficitur elit. Ut consequat libero id varius aliquam. Nulla placerat viverra aliquet. ' +
  'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. ' +
  'Nunc vestibulum libero in nunc faucibus sagittis. In a ipsum leo. Cras auctor massa non euismod hendrerit. ' +
  'Ut viverra quam sit amet enim rutrum volutpat. Aenean hendrerit nulla ac urna dignissim posuere. ' +
  'Pellentesque non bibendum metus, vel tempor est. Pellentesque laoreet posuere enim, ac viverra nibh ' +
  'lacinia sit amet. Pellentesque sit amet rhoncus massa, ut maximus justo.',

  history: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
  'Nulla fermentum nisi sit amet odio tempor, vel fringilla metus porttitor. ' +
  'Curabitur eu efficitur elit. Ut consequat libero id varius aliquam. Nulla placerat viverra aliquet. ' +
  'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. ' +
  'Nunc vestibulum libero in nunc faucibus sagittis. In a ipsum leo. Cras auctor massa non euismod hendrerit. ' +
  'Ut viverra quam sit amet enim rutrum volutpat. Aenean hendrerit nulla ac urna dignissim posuere. ' +
  'Pellentesque non bibendum metus, vel tempor est. Pellentesque laoreet posuere enim, ac viverra nibh ' +
  'lacinia sit amet. Pellentesque sit amet rhoncus massa, ut maximus justo.'
};

const INIT_TEAM_MEMBERS = [{
  _id: new ObjectId(),
  name: 'Trustee Member 1',
  info: `adhas da skdhask dhajd kja dkjah dsk asghd as dhkjahsdkh ajkshd jkasasd asd asdasjdh kjash djkasdjk jaksdkasjd
   adhas da skdhask dhajd kja dkjah dsk asghd as dhkjahsdkh ajkshd jkasasd asd asdasjdh kjash djkasdjk jaksdkasjd
   adhas da skdhask dhajd kja dkjah dsk asghd as dhkjahsdkh ajkshd jkasasd asd asdasjdh kjash djkasdjk jaksdkasjd
   adhas da skdhask dhajd kja dkjah dsk asghd as dhkjahsdkh ajkshd jkasasd asd asdasjdh kjash djkasdjk jaksdkasjd`,
  pic: '/team/person1.png',
  type: 'trustee',
  designation: 'Chief of Operation'
}, {
  name: 'Trustee Member 2',
  info: `adhas da skdhask dhajd kja dkjah dsk asghd as dhkjahsdkh ajkshd jkasasd asd asdasjdh kjash djkasdjk jaksdkasjd
   adhas da skdhask dhajd kja dkjah dsk asghd as dhkjahsdkh ajkshd jkasasd asd asdasjdh kjash djkasdjk jaksdkasjd
   adhas da skdhask dhajd kja dkjah dsk asghd as dhkjahsdkh ajkshd jkasasd asd asdasjdh kjash djkasdjk jaksdkasjd
   adhas da skdhask dhajd kja dkjah dsk asghd as dhkjahsdkh ajkshd jkasasd asd asdasjdh kjash djkasdjk jaksdkasjd`,
  pic: '/team/person2.png',
  type: 'trustee',
  designation: 'Chief of Marketing'
}, {
  name: 'Technical Member',
  info: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc molestie euismod dolor,
  id malesuada ex elementum non. Morbi nisi eros, ultricies quis nisl id, pellentesque tristique eros.
  Fusce augue quam, lobortis bibendum efficitur at, mollis vitae dui. Vestibulum ante ipsum primis in
  faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur lectus lorem, accumsan vel turpis at,
  consequat semper tellus. Praesent vel quam non ex tristique mattis. Nam scelerisque arcu tristique justo
  bibendum tincidunt ut a dolor. Praesent orci enim, blandit vel dui vitae, tristique mattis nulla. Mauris
  vitae lectus hendrerit, congue sem ac, accumsan nunc. Aliquam quis euismod nisl. Integer tempus ac velit non
  venenatis. Morbi imperdiet rhoncus diam, ut venenatis sem ultricies vitae. Vivamus aliquam elementum mi ut
  suscipit.`,
  pic: '/team/person3.png',
  type: 'technical',
  designation: 'Technical Chief'
}, {
  name: 'Ambassador Member',
  info: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc molestie euismod dolor,
  id malesuada ex elementum non. Morbi nisi eros, ultricies quis nisl id, pellentesque tristique eros.
  Fusce augue quam, lobortis bibendum efficitur at, mollis vitae dui. Vestibulum ante ipsum primis in
  faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur lectus lorem, accumsan vel turpis at,
  consequat semper tellus. Praesent vel quam non ex tristique mattis. Nam scelerisque arcu tristique justo
  bibendum tincidunt ut a dolor. Praesent orci enim, blandit vel dui vitae, tristique mattis nulla. Mauris
  vitae lectus hendrerit, congue sem ac, accumsan nunc. Aliquam quis euismod nisl. Integer tempus ac velit non
  venenatis. Morbi imperdiet rhoncus diam, ut venenatis sem ultricies vitae. Vivamus aliquam elementum mi ut
  suscipit.`,
  pic: '/team/person4.png',
  type: 'ambassador'
}, {
  _id: new ObjectId(),
  name: 'Volunteer Member',
  info: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc molestie euismod dolor,
  id malesuada ex elementum non. Morbi nisi eros, ultricies quis nisl id, pellentesque tristique eros.
  Fusce augue quam, lobortis bibendum efficitur at, mollis vitae dui. Vestibulum ante ipsum primis in
  faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur lectus lorem, accumsan vel turpis at,
  consequat semper tellus. Praesent vel quam non ex tristique mattis. Nam scelerisque arcu tristique justo
  bibendum tincidunt ut a dolor. Praesent orci enim, blandit vel dui vitae, tristique mattis nulla. Mauris
  vitae lectus hendrerit, congue sem ac, accumsan nunc. Aliquam quis euismod nisl. Integer tempus ac velit non
  venenatis. Morbi imperdiet rhoncus diam, ut venenatis sem ultricies vitae. Vivamus aliquam elementum mi ut
  suscipit.`,
  pic: '/team/person5.png',
  type: 'volunteer'
}];

const INIT_PROJECTS = [{
  _id: new ObjectId(),
  name: 'Project XYZ',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
  'Nulla fermentum nisi sit amet odio tempor, vel fringilla metus porttitor. ' +
  'Curabitur eu efficitur elit. Ut consequat libero id varius aliquam. Nulla placerat viverra aliquet. ' +
  'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. ' +
  'Nunc vestibulum libero in nunc faucibus sagittis. In a ipsum leo. Cras auctor massa non euismod hendrerit. ' +
  'Ut viverra quam sit amet enim rutrum volutpat. Aenean hendrerit nulla ac urna dignissim posuere. ' +
  'Pellentesque non bibendum metus, vel tempor est. Pellentesque laoreet posuere enim, ac viverra nibh ' +
  'lacinia sit amet. Pellentesque sit amet rhoncus massa, ut maximus justo.',
  pics: [{_id: new ObjectId(), url: '/projects/project1.jpg'}, {url: '/projects/project2.jpg'}]
}, {
  _id: new ObjectId(),
  name: 'Project ABC',
  description: 'Fusce commodo porta molestie. Vestibulum ac tellus condimentum, auctor felis sed, pharetra eros. ' +
  'Sed placerat eget elit ut feugiat. Pellentesque nec dictum lorem. Morbi luctus dignissim arcu et venenatis. ' +
  'Fusce ac fringilla lorem. Morbi pharetra at ex in sollicitudin. Donec commodo, nulla et mollis finibus, ' +
  'mauris dolor eleifend nisl, eget cursus arcu leo id risus.',
  pics: [{url: '/projects/project3.jpg'}, {url: '/projects/project4.jpg'}]
}];

const INIT_ACTIVITIES = [{
  _id: new ObjectId(),
  name: 'Card Making',
  description: 'Fusce commodo porta molestie. Vestibulum ac tellus condimentum, auctor felis sed, pharetra eros. ' +
  'Sed placerat eget elit ut feugiat. Pellentesque nec dictum lorem. Morbi luctus dignissim arcu et venenatis. ' +
  'Fusce ac fringilla lorem. Morbi pharetra at ex in sollicitudin. Donec commodo, nulla et mollis finibus, ' +
  'mauris dolor eleifend nisl, eget cursus arcu leo id risus.',
  pics: [{url: '/activities/Card1.jpg'}, {url: '/activities/Card2.jpg'}, {url: '/activities/Card3.jpg'}]
}, {
  _id: new ObjectId(),
  name: 'Social Activities',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
  'Nulla fermentum nisi sit amet odio tempor, vel fringilla metus porttitor. ' +
  'Curabitur eu efficitur elit. Ut consequat libero id varius aliquam. Nulla placerat viverra aliquet. ' +
  'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. ' +
  'Nunc vestibulum libero in nunc faucibus sagittis. In a ipsum leo. Cras auctor massa non euismod hendrerit. ' +
  'Ut viverra quam sit amet enim rutrum volutpat.',
  pics: [{url: '/activities/social1.jpg'}, {url: '/activities/social2.jpg'}]
}];

const populateAdmins = () => {
  return Admin.remove({}).then(() => {
    return new Admin(INIT_ADMIN).save();
  });
};

const populateHomePage = () => {
  const sourceHomeDir = 'init-resources/home';
  const targetHomeDir = RESOURCES_DIR + '/home';

  return new Promise(resolve => {
    ncp(sourceHomeDir, targetHomeDir, err => {
      if (err)  throw err;
      resolve();
    });
  }).then(() => {
    return HomePage.remove({});
  }).then(() => {
    return HomePage.insertMany(INIT_HOME_PAGE);
  });
};

const populateAboutUs = () => {
  return AboutUs.remove({}).then(() => {
    return new AboutUs(INIT_ABOUT_US).save();
  });
};

const populateTeamMembers = () => {
  const sourceAboutDir = 'init-resources/team';
  const targetAboutDir = RESOURCES_DIR + '/team';

  return new Promise(resolve => {
    ncp(sourceAboutDir, targetAboutDir, err => {
      if (err)  throw err;
      resolve();
    });
  }).then(() => {
    return TeamMember.remove({});
  }).then(() => {
    return TeamMember.insertMany(INIT_TEAM_MEMBERS);
  });
};

const populateProjects = () => {
  const sourceProjectsDir = 'init-resources/projects';
  const targetProjectsDir = RESOURCES_DIR + '/projects';

  return new Promise(resolve => {
    ncp(sourceProjectsDir, targetProjectsDir, err => {
      if (err)  throw err;
      resolve();
    });
  }).then(() => {
    return Project.remove({});
  }).then(() => {
    return Project.insertMany(INIT_PROJECTS);
  });
};

const INIT_TESTIMONIALS_INFO = [{
  heading: 'Next to our Elite Complex, there are a number of sprawling slums.',
  message: `Next to our Elite Complex, there are a number of sprawling slums. I always thought that I
          must do something for the people of these areas who have equal rights to live decent lives
          just as we do. They must get the basic education and health facilities. What kind of
          society or nation we are going to create when millions of people are in dire need of food,
          education and elementary health facilities?. During one of my visits to these areas I came
          across Sona Sarovar Trust and in particular Ms. Sona Kumar who has been doing exemplary
          work in her own small way. Since then I have been supporting her by contributing my time
          and the fund.`,
  testimonialGiverName: 'Mr.Pradyumn Patel',
  testimonialGiverDesignation: 'Social Worker'
},  {
  heading: 'Next to our Elite Complex, there are a number of sprawling slums.',
  message: `Next to our Elite Complex, there are a number of sprawling slums. I always thought that I
          must do something for the people of these areas who have equal rights to live decent lives
          just as we do. They must get the basic education and health facilities. What kind of
          society or nation we are going to create when millions of people are in dire need of food,
          education and elementary health facilities?. During one of my visits to these areas I came
          across Sona Sarovar Trust and in particular Ms. Sona Kumar who has been doing exemplary
          work in her own small way. Since then I have been supporting her by contributing my time
          and the fund.`,
  testimonialGiverName: 'Mr.Pradyumn Patel',
  testimonialGiverDesignation: 'Social Worker'
}];

const INIT_AWARDS = [{
  url: '/awards/guide-star1.png'
}, {
  url: '/awards/guide-star2.png'
}];

const populateTestimonials = () => {
  return Testimonial.remove().then(() => {
    Testimonial.insertMany(INIT_TESTIMONIALS_INFO);
  });
};

const populateActivities = () => {
  const sourceProjectsDir = 'init-resources/activities';
  const targetProjectsDir = RESOURCES_DIR + '/activities';

  return new Promise(resolve => {
    ncp(sourceProjectsDir, targetProjectsDir, err => {
      if (err)  throw err;
      resolve();
    });
  }).then(() => {
    return Activity.remove({});
  }).then(() => {
    return Activity.insertMany(INIT_ACTIVITIES);
  });
};

const populateAwards = () => {
  const sourceProjectsDir = 'init-resources/awards';
  const targetProjectsDir = RESOURCES_DIR + '/awards';

  return new Promise(resolve => {
    ncp(sourceProjectsDir, targetProjectsDir, err => {
      if (err)  throw err;
      resolve();
    });
  }).then(() => {
    return Award.remove({});
  }).then(() => {
    return Award.insertMany(INIT_AWARDS);
  });
};

const populateAll = () => {
  return Promise.all([
    populateAdmins(), populateHomePage(), populateAboutUs(),
    populateTeamMembers(), populateProjects(), populateActivities(),
    populateTestimonials(), populateAwards()
  ]);
};

module.exports = {
  INIT_ADMIN,
  INIT_HOME_PAGE,
  INIT_TEAM_MEMBERS,
  INIT_PROJECTS,
  INIT_ACTIVITIES,
  populateAll,
  populateHomePage,
  populateAboutUs,
  populateTeamMembers,
  populateProjects
};
