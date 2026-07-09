# Bitter Splitter

A lightweight bill-splitting web app that makes it easy to manage shared
expenses with friends, roommates, classmates, or travel groups.

## Deployed Webapp

https://sheikh-rashdan.github.io/bitter-splitter-webapp/

## Features

- Create and save multiple groups of people.
- Add bills with custom amounts and participants.
- Automatically split expenses between selected members.
- View previously created bills and groups.
- Edit bills after creation
- Mobile-friendly and desktop-friendly interface.
- Data persistence using browser storage.

## Built With

- HTML5
- CSS3
- JavaScript (Vanilla JS)

## Storage Structure

```
groups = {
  {
  	name: "Group Name",
  	members: ["Member 1", "Member 2", "Member 3"],
  	bills: [
  		{
  			id: 34ce60a0-dfe4-4cd8-bc7c-a772e40daf95
  			date: 08/07/26 05:16 PM,
  			total: 120,
  			items: [
  				{
  					name: "Item 1",
  					cost: 80,
  					splitBy: ["Member 1", "Member 2"]
                },
              	{
                  name: "Item 2",
                  cost: 40,
                  splitBy: ["Member 2", "Member 3"]
                }
            ]
        }
    ]
  }
}
```

## Screenshots
<p align="center">
  <img width="400" height="740" alt="bitter-splitter-view-groups" src="https://github.com/user-attachments/assets/dacb7eb7-722a-4865-8543-f4595e8e0ced" /><br />
  Selecting a Group<br /><br />
  <img width="400" height="790" alt="bitter-splitter-create-group" src="https://github.com/user-attachments/assets/dd450880-a1c8-4a15-9e36-ec8cfe9bbffd" /><br />
  Creating a Group<br /><br />
  <img width="400" height="890" alt="bitter-splitter-view-bills" src="https://github.com/user-attachments/assets/342c109d-a111-46b4-a259-50fbde3f1d1d" /><br />
  Viewing Bills<br /><br />
  <img width="400" height="1270" alt="bitter-splitter-create-bill" src="https://github.com/user-attachments/assets/83d404db-e3b5-4539-952e-4f2a0fc33e0c" /><br />
  Creating a Bill<br /><br />
  <img width="400" height="1355" alt="bitter-splitter-view-bill" src="https://github.com/user-attachments/assets/689f1933-03a6-4efc-99aa-43e6ea94ebdb" /><br />
  Viewing a Bill<br /><br />
  <img width="400" height="650" alt="bitter-splitter-edit-bill" src="https://github.com/user-attachments/assets/a4075962-c2d7-4a76-88c3-547e8c8ff998" /><br />
  Editing a Bill
</p>
