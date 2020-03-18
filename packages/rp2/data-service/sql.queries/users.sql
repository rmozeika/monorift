SELECT * FROM users WHERE username='bjeandeaut';

SELECT users.username, friendship.status
FROM users
INNER JOIN friendship ON friendship.member2_id =  users.id
WHERE friendship.member1_id = (
    SELECT id from users WHERE username='robertmozeika20'
)