TODO:

High Priority:
Think something of filter tree wala flow
Replace usePrevios with react.usememo
Try to abstract out repritive things
use native0base properly or use material or other theming
eslint configure
make sure to Use spacing,fotn,color from variables
Use optionsbar correctly, find a way to use it globally somewhere
Use prefix "\_" wherever scope mismatch is there

Low Priority:
Push notification
Restrict map to particular radius
import eslint plugin not working

Flows:

1.
Non moderator user will add a tree group. He/She will see blinking icon for newly added tree. When clicked
on blinking icon, it will show "Awaiting approval from moderator". (Working)
Another non moderator user will not see this newly added tree/ blinking icon. (Working)
Moderator will see newly added tree as a blinking icon and he/she can click to see approve modal and click on approve or reject. (Working)
Approve will make tree visible to everyone (moderator, non moderator tree creator, non moderator another user).(Working)
Reject will remove tree from everywhere. (Not Working)

2.
Non moderator user will delete a tree group. He/ she will see blinking icon for deleted tree. When clicked on red blinking icon, it will show awaiting approval from moderator. (Working/ Sometimes red blinking icon is not visible neither normal icon)
Any other non moderator user will not see this blinking icon and will rather see normal tree icon. (Not Working)
Moderator will see red blinking icon. When clicked it will open a delete approve modal. (Working)
Delete will delete the tree and tree will not be visible to anyone. (Working)
Reject will make tree appear normal for both moderator and non moderator user who deleted the tree. (Working)
