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
