import fetch from "node-fetch";

const zendesk_url = process.env.ZENDESK_URL;

export default async function handler(req, res) {
  try {
    const ticketId = req.query.ticketid;

    console.log({ query: req.query })
    console.log({ ticketId: req.query.ticketid })
    console.log({ authorization: req.headers.authorization })
    const ticketResponse = await fetch(`${zendesk_url}/api/v2/tickets/${ticketId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization
      }
    });
    const ticketData = await ticketResponse.json();


    console.log({ ticketData });

    const resp = await fetch(`${zendesk_url}/api/v2/groups/${ticketData.ticket.group_id}/users`, {
      method: "GET",
      headers: {
        Authorization: req.headers.authorization
      }
    });
    const usersData = await resp.json();

    console.log({ usersData });

    const alphabeticUsers = usersData.users.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
    })

    const usersInOffice = alphabeticUsers.filter((user) => !user.user_fields.agent_ooo);
    let currentAssignee;
    let nextAssignee;
    if (usersInOffice.length > 0) {

      if (usersInOffice.length === 1) {
        currentAssignee = usersInOffice[0];
        nextAssignee = usersInOffice[0];
      } else {
        currentAssignee = usersInOffice.find((user) => user.user_fields.assign_next);

        if (!currentAssignee) {
          currentAssignee = usersInOffice[0];
          nextAssignee = usersInOffice[1];
        } else {
          const currentAssigneeIndex = usersInOffice.indexOf(currentAssignee);
          if (currentAssigneeIndex === usersInOffice.length - 1) {
            nextAssignee = usersInOffice[0];
          } else {
            nextAssignee = usersInOffice[currentAssigneeIndex + 1]
          }
        }
      }


      await fetch(`${zendesk_url}/api/v2/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization

        },
        body: JSON.stringify({
          ticket: {
            assignee_email: currentAssignee.email,
            assignee_id: currentAssignee.id
          }
        })
      })

      await fetch(`${zendesk_url}/api/v2/users/update_many`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization
        },
        body: JSON.stringify({
          users: [
            {
              id: currentAssignee.id, user_fields: { assign_next: false }
            },
            {
              id: nextAssignee.id, user_fields: { assign_next: true }
            }
          ]
        })
      })
    }

    res.status(200).json({ message: 'Round robin executed on ticket ' + ticketId, currentAssignee: currentAssignee ? currentAssignee.name : 'NA', nextAssignee: nextAssignee ? nextAssignee.name : '' });
  } catch (e) {
    console.log(e);
  }
}