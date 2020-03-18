SELECT users.username, friendship.status
FROM users
INNER JOIN friendship ON friendship.member2_id =  users.id
WHERE friendship.member1_id = (
    SELECT id from users WHERE username='robertmozeika20'
)

SELECT member2_id from friendship WHERE member1_id = (SELECT id from users WHERE username='robertmozeika')

SELECT id, users.username
FROM users AS U
UNION
SELECT member1_id, member2_id
-- SELECT * from friendship where member1_id = 274;
DELETE from friendship WHERE member2_id = 236 AND member1_id=274;
SELECT users.id, users.username, friendship.status, member1_id, member2_id
FROM users
LEFT JOIN friendship ON friendship.member2_id = users.id AND member1_id = (
    SELECT id from users WHERE username='robertmozeika20'
)

ORDER BY friendship.status
SELECT * from users where id=236 
WHERE member1_id = '274';
-- WHERE f.member1_id = (
--     SELECT id from users WHERE username='robertmozeika20'
-- )
-- SELECT * from users;
-- SELECT * from friendship
-- 
-- WHERE friendship.member2_id =
-- WHERE friendship.member1_id = users.id
-- WHERE users.username = 'robertmozeika'
-- SELECT * from friendship WHERE member1_id=235
-- SELECT DIS from friendship;