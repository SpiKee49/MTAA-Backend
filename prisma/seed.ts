import { db } from '../src/utils/db.server';

type User = {
  username: string;
  email: string;
  password: string;
  profileName: string;
};

type Post = {
  title: string;
  description?: string;
  photo: Buffer;
};

type Album = {
  title: string;
  tags?: string[];
  description?: string;
};

type Location = {
  name: string;
  longitude: string;
  latitude: string;
};

async function seed() {
  // drop existing data from DB before generating new sample
  await db.album.deleteMany();
  await db.user.deleteMany();
  await db.location.deleteMany();
  await db.post.deleteMany();

  //create Locations
  await Promise.all(
    getLocations().map(location => {
      const { name, longitude, latitude } = location;
      return db.location.create({
        data: {
          name,
          longitude,
          latitude,
        },
      });
    })
  );

  const locations = await db.location.findMany();

  //create Users
  await Promise.all(
    getUsers().map(user => {
      const { username, password, email, profileName } =
        user;
      return db.user.create({
        data: {
          username,
          password,
          email,
          profileName,
        },
      });
    })
  );
  const users = await db.user.findMany();

  //create Albums
  await Promise.all(
    getAlbums().map(album => {
      const { title, tags, description } = album;
      return db.album.create({
        data: {
          title,
          tags,
          description,
          ownerId:
            users[Math.floor(Math.random() * users.length)]
              .id,
        },
      });
    })
  );

  const albums = await db.album.findMany();

  //create Posts
  await Promise.all(
    getPosts().map(post => {
      const { title, photo, description } = post;
      return db.post.create({
        data: {
          title,
          description,
          photo,
          userId:
            users[Math.floor(Math.random() * users.length)]
              .id,
          locationId:
            locations[
              Math.floor(Math.random() * locations.length)
            ].id,
          albumId:
            albums[
              Math.floor(Math.random() * albums.length)
            ].id,
        },
      });
    })
  );
}

seed();

function getUsers(): User[] {
  return [
    {
      username: 'tobyKing1',
      profileName: 'Toby King Kovacs',
      email: 'toby1@test.com',
      password: 'toby1kenobi',
    },
    {
      username: 'roko.rapgod',
      profileName: 'Roko Superstars',
      email: 'roko@vevo.com',
      password: 'rokostar',
    },
    {
      username: 'lepsi.ako.50cent',
      profileName: 'Maly Šori Exto',
      email: 'himanejm@test.com',
      password: 'fiftycenta',
    },
    {
      username: 'r.y.t.m.o',
      profileName: 'Hrbatý Ceckatý C-word',
      email: 'rytmo@rukadole.com',
      password: 'donfantastickypess',
    },
  ];
}

function getPosts(): Post[] {
  return [
    {
      title: 'Prvy prispevocek',
      description: 'Majte sa radi priatelia',
      photo: Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/',
        'utf-8'
      ),
    },
    {
      title: 'Druhy prispevocek',
      description: 'Koho to zaujima',
      photo: Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/',
        'utf-8'
      ),
    },
    {
      title: 'Alebo aj nie',
      description: 'Milos disk',
      photo: Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/',
        'utf-8'
      ),
    },
    {
      title: 'Eno vueno sapa',
      description: 'co to tu na mna skusate prosim vas',
      photo: Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/',
        'utf-8'
      ),
    },
    {
      title: 'Pekne kvety',
      description: 'koľko stáli',
      photo: Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/',
        'utf-8'
      ),
    },
    {
      title: 'Neviem asi dve hodiny',
      description: 'Jaj tak dobre potom',
      photo: Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/',
        'utf-8'
      ),
    },
  ];
}

function getLocations(): Location[] {
  return [
    {
      name: 'Hotel Hilton',
      latitude: '48.13941048398324', // Pentagon Bratislava
      longitude: '17.204298784532334',
    },
    {
      name: 'Lujs Vynton Bratislava',
      latitude: '48.17677398662877', // Tesco Lamač
      longitude: '17.06544830967026',
    },
    {
      name: 'Mount Everest z Lidla',
      latitude: '49.19658843800614', // Lomnicky štít
      longitude: '20.213747396503443',
    },
  ];
}

function getAlbums(): Album[] {
  return [
    {
      title: 'Zazitky ze fest',
      description:
        'Ta ked ides na pumpu si kupit hotdog od Separa za 2 eura, tak tuna mozes dat fotku, alebo tak, chapes ne',
      tags: ['zivot', 'life', 'bytie'],
    },
    {
      title: 'Herne a ine spolocenske aktivity',
      description:
        'Ked si vo Vranove v Sinote vytocil jackpot 2.50 ale vklad bol 10',
      tags: [
        'zeny',
        'jedlo',
        'herne',
        'ovocko',
        'maty',
        'milionari z chatrce',
      ],
    },
    {
      title: 'Turisticke vystupy pre vozickarov',
      description:
        'Pre ludi, ktori radi ziju na hrane chodnika a vozovky, ak sa rozumieme',
      tags: ['catchmeifyoucan', '2fast4you', 'hotwheels'],
    },
  ];
}
