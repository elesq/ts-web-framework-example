// import { User } from './models/User';
// import { UserEdit } from './views/UserEdit';

// const root = document.getElementById('root') as Element;

// const user = User.buildUser({ name: 'ed', age: 51 });

// if (root) {
//     const userEdit = new UserEdit(root, user);
//     userEdit.render();
//     console.log(userEdit);
// }

// if (root) {
//     const userForm = new UserForm(root, user);
//     userForm.render();
// } else {
//     throw new Error('root element not found');
// }

import { Collection } from './models/Collection';
import { User, UserProps } from './models/User';
import { UserList } from './views/UserList';

const users = new Collection(
    'http://localhost:3000/users',
    (json: UserProps) => {
        return User.buildUser(json);
    }
);

users.on('change', () => {
    const root = document.getElementById('root');

    if (root) {
        new UserList(root, users).render();
    }
});
users.fetch();
