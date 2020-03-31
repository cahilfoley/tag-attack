interface Message {
  content: string
  sender: string
  prefix?: string
}

let farewellMessages: Message[] = [
  {
    content: trimmed`
      Dear FJ,
      <br/><br/>
      It was such a great pleasure working with you.<br/>
      Words are not enough to express how grateful and blessed we are for having you in the team.<br/>
      You have been a great team player, coach and ARBIA lead to the team, including me, and you have assisted us tremendously with ARBIA and improving our servers.<br/>
      I personally have learnt a lot from you around the architecture.<br/>
      Once again, thank you for your great support and contribution. Perth is small. So, I’m sure we will meet again.<br/>
      Take care of yourself and your family, and Good luck in your new and upcoming projects.<br/>
      God bless,<br/>
      <br/>
      Tina
    `,
    sender: 'Tina'
  },
  {
    content: trimmed`
      Yooo,<br/>
  <br/>
      This definitely isn't goodbye since we're in the same team.... but it's been awesome working in the AMES team with you. Thanks for listening to my pre-coffee rambles, and for always somehow figuring out easy fixes to my annoying DAX and SQL problems.<br/>
      Here's to more coffee catchups in the (hopefully) near future 😁<br/>
      Thanks for everything!<br/>
  <br/>
      Ayesha
    `,
    sender: 'Ayesha'
  },
  {
    content: trimmed`
      See yaaa FJ !!
  <br/><br/>
      Not only have I enjoyed working with you, but I have also gained a lot of experience. Thank you for your support and kindness.<br/>
      I wish you the best of luck and continued success whereever you may find yourself.<br/>
  <br/>
      With all good wishes,<br/>
  <br/>
      Sharief
    `,
    sender: 'Sharief'
  },
  {
    content: trimmed`
      Hola FJ!<br/>
        <br/>
      Thank you so much for all the mentoring you have provided and the laughs shared. I wish you all the best with your next project and hope you miss us so terribly that you come back once its done 🙂 Stay safe you rock-star.<br/>
      Yours from afar,<br/>
      <br/>
      Boxy
    `,
    sender: 'Boxy',
    prefix: 'Space Cadet'
  },
  {
    content: trimmed`
      BYEEEEEEEEEEEE FJ!!
      <br/><br/>
      It has been a pleasure fighting with you for the last (Can’t even remember how long.. its been a long time).
      I’ll miss coming over to you and bypassing our beloved RTTMS system to get AUPERSQL117 in tip top shape when it falls over, although we haven’t directly worked with each other much, we can always rely on 117’s problems to bring us together J
      But on a serious note, your thorough understanding of the teams architecture and the developments you have made to make 117 usable is really commendable and I thank you for your hard work (We all know it probably some of the most stressful stuff) you will be missed thoroughly.
      Yours truly, the annoying guy who comes to you to fix things J
      <br/><br/>
      Kent
    `,
    sender: 'Kent'
  },
  {
    content: trimmed`
      Hi FJ,
      <br/>
      <br/>
      Thanks for all your time and help with SQL, SSRS, PowerBI.... well <span class='flashing'><em>everything!</em></span> You have been a great source of information and your input is always highly valued.
      <br/>
      <br/>
      I ran of words and used them all on this with <span class='flashing'>Cahil</span> . 
      <br/>
      <br/>
      Stay in touch and enjoy your game,
      <br/>
      <br/>
      <span class='flashing'>Steve</span>
      `,
    sender: `<span class='flashing'>Steve</span>`
  },
  {
    content: trimmed`
      Hey Database Super-Guru,
      <br/>
      <br/>
      Thanks for all your help over what feels like years now, you've been an absolute star when we've been under the pump. You will be sorely missed, I only wish that I got to work with you more!
      <br/>
      <br/>
      I don't think words can really do it justice so I hope this game that Steve and I made for you sums it up 😁.
      <br/>
      <br/>
      All the best for everything the future holds, I hope our (atleast virtual) paths cross again one day!
      <br/>
      <br/>
      <span class='flashing'>Cahil</span>
    `,
    sender: `<span class='flashing'>Cahil</span>`
  },
  {
    content: trimmed`
      Hey FJ,
      <br/>
      <br/>
      Thanks for all your help and for the coffee chats every morning
      <br/>
      See you on the other side
      <br/>
      <br/>
      Matt
    `,
    sender: 'Matt'
  }
]
