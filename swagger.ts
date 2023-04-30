const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';

const endpointsFiles = ['./src/index.ts'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'APIs',
    description:
      'Documentation automatically generated by the <b>swagger-autogen</b> module.',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Users',
      description: 'User api',
    },
    {
      name: 'Albums',
      description: 'Albums api',
    },
    {
      name: 'Posts',
      description: 'Posts api',
    },
    {
      name: 'Locations',
      description: 'Locations api',
    },
    {
      name: 'Requests',
      description: 'Requests api',
    },
  ],
  securityDefinitions: {},
  definitions: {
    User: {
      id: '152521515',
      username: 'SomeName',
      profileName: 'Dude 1',
      email: 'thisIsTheemail@gmail.com',
    },
    UserList: [{ $ref: '#/definitions/User' }],
    UserDetail: {
      id: '152521515',
      username: 'SomeName',
      profileName: 'Dude 1',
      email: 'thisIsTheemail@gmail.com',
      followedAlbums: { $ref: '#/definitions/AlbumList' },
      ownedAlbums: { $ref: '#/definitions/AlbumList' },
      friends: { $ref: '#/definitions/UserList' },
      friendedBy: { $ref: '#/definitions/UserList' },
      likedPost: { $ref: '#/definitions/PostList' },
      posts: { $ref: '#/definitions/PostList' },
    },
    Location: {
      id: 152,
      name: 'Lomnicky Stit',
      longitude: '49.19658843800614',
      latitude: '20.213747396503443',
    },
    LocationList: [{ $ref: '#/definitions/Location' }],
    AddLocation: {
      $name: 'Tesco Lamač Bratislava',
      $longitude: '48.17677398662877',
      $latitude: '17.06544830967026',
    },
    UpdateLocation: {
      $name: 'Tesco Lamač Bratislava',
      $longitude: '48.17677398662877',
      $latitude: '17.06544830967026',
    },

    Album: {
      id: 111,
      title: 'Stretnutie na plazi',
      description: '',
      ownerId: '152521515',
      tags: ['leto', 'more', 'relax'],
    },
    AlbumList: [{ $ref: '#/definitions/Album' }],
    AddAlbum: {
      $title: 'Novy rok nove ja',
      description:
        'Zmena je na dosah, tento rok to bude ine',
      tags: ['Silvester', 'novy', 'predsavzatia'],
      $ownerId: '152521515',
    },
    UpdateAlbum: {
      $title: 'Prvy april',
      description:
        'Ako Abraham Lincoln raz povedal: never nicomu co vidis na internete',
      tags: ['blazni', 'prvyapril'],
    },

    Post: {
      id: 15,
      title: 'Potapanie sa',
      photo: Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/',
        'utf-8'
      ),
      description: 'Nie vsetky dobre veci su napovrchu',
      userId: '152521515',
      albumId: 111,
      locationId: 145,
    },
    PostDetail: {
      id: 15,
      title: 'Potapanie sa',
      photo: Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/',
        'utf-8'
      ),
      description: 'Nie vsetky dobre veci su napovrchu',
      userId: '152521515',
      albumId: 111,
      locationId: 145,
      location: { $ref: '#/definitions/Location' },
      album: { $ref: '#/definitions/Album' },
      user: { $ref: '#/definitions/User' },
      likedBy: [{ $ref: '#/definitions/User' }],
    },
    PostList: [{ $ref: '#/definitions/Post' }],
    AddPost: {
      $title: 'Potapanie sa',
      $photo: 'Base64String',
      description: 'Nie vsetky dobre veci su napovrchu',
      $userId: '152521515',
      $albumId: 111,
      $locationId: 145,
    },
    Request: {
      id: 12,
      fromID: '152521515',
      toID: '295821485',
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./src/index.ts');
});
