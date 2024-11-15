const DiscordContact = (username: string, color: string) => {
  return (
    <g
      id='Discord_Contact'
      data-name='Discord Contact'
    >
      <g
        id='Discord_Logo_Clyde_'
        data-name='Discord Logo (Clyde)'
        clip-path='url(#clip-path)'
      >
        <path
          id='Path_7'
          data-name='Path 7'
          d='M33.649,2.923A32.778,32.778,0,0,0,25.558.414a.123.123,0,0,0-.13.062,22.833,22.833,0,0,0-1.007,2.069,30.26,30.26,0,0,0-9.087,0A20.941,20.941,0,0,0,14.31.475a.128.128,0,0,0-.13-.062A32.687,32.687,0,0,0,6.09,2.923a.116.116,0,0,0-.053.046A33.547,33.547,0,0,0,.164,25.593a.136.136,0,0,0,.052.093A32.962,32.962,0,0,0,10.141,30.7a.129.129,0,0,0,.139-.046,23.558,23.558,0,0,0,2.03-3.3.126.126,0,0,0-.069-.175,21.707,21.707,0,0,1-3.1-1.478.128.128,0,0,1-.013-.211c.208-.156.417-.319.616-.483a.123.123,0,0,1,.128-.017,23.506,23.506,0,0,0,19.976,0,.122.122,0,0,1,.13.016c.2.164.407.328.617.484a.127.127,0,0,1-.011.211,20.369,20.369,0,0,1-3.1,1.476.127.127,0,0,0-.067.177,26.452,26.452,0,0,0,2.029,3.3.126.126,0,0,0,.139.047,32.852,32.852,0,0,0,9.941-5.017.128.128,0,0,0,.052-.091A33.327,33.327,0,0,0,33.7,2.971.1.1,0,0,0,33.649,2.923ZM13.283,21.077A3.82,3.82,0,0,1,9.71,17.071a3.8,3.8,0,0,1,3.572-4.006,3.779,3.779,0,0,1,3.572,4.006A3.8,3.8,0,0,1,13.283,21.077Zm13.208,0a3.82,3.82,0,0,1-3.572-4.006,3.8,3.8,0,0,1,3.572-4.006,3.779,3.779,0,0,1,3.572,4.006A3.789,3.789,0,0,1,26.49,21.077Z'
          fill={color}
        />
      </g>
      <text
        id='username'
        fill={color}
        font-size='25'
        font-family='var(--monospace-font-family)'
        font-weight='700'
      >
        <tspan
          x='55'
          y='22'
        >
          {username}
        </tspan>
      </text>
    </g>
  );
};

const PhoneContact = (phoneNumber: string, color: string) => {
  return (
    <g
      id='Phone_Contact'
      data-name='Phone Contact'
    >
      <g
        id='WhatsApp_Logo'
        data-name='WhatsApp Logo'
      >
        <path
          id='Inner_Phone'
          data-name='Inner Phone'
          d='M95.687,89.444c-.06-.029-2.32-1.142-2.722-1.286a1.563,1.563,0,0,0-.526-.116.9.9,0,0,0-.761.451c-.226.336-.909,1.134-1.12,1.373-.028.032-.065.069-.088.069s-.37-.144-.476-.19a11.893,11.893,0,0,1-4.517-4.013.25.25,0,0,1-.038-.089.729.729,0,0,1,.132-.156c.123-.122.256-.282.385-.438.061-.074.122-.147.182-.217a2.435,2.435,0,0,0,.367-.583l.051-.1a1.054,1.054,0,0,0-.031-.992c-.053-.107-1.008-2.41-1.109-2.652-.244-.584-.566-.856-1.014-.856-.042,0,0,0-.174.007a5.417,5.417,0,0,0-1.879.483,3.934,3.934,0,0,0-1.459,3.346,7.213,7.213,0,0,0,1.564,3.971c.012.016.033.047.064.093a14.722,14.722,0,0,0,6.315,5.482,10.27,10.27,0,0,0,3.814.975h0a5.959,5.959,0,0,0,.621-.037l.111-.011a4.009,4.009,0,0,0,2.8-1.978,3.127,3.127,0,0,0,.178-2.059A1.426,1.426,0,0,0,95.687,89.444Z'
          transform='translate(-72.749 -71.631)'
          fill={color}
        />
        <path
          id='Outer_Circle'
          data-name='Outer Circle'
          d='M15.775,0A15.187,15.187,0,0,0,.549,15.112a15,15,0,0,0,2.088,7.642L.022,30.468a.4.4,0,0,0,.5.513l8.044-2.556A15.25,15.25,0,0,0,31,15.112,15.186,15.186,0,0,0,15.775,0Zm0,27.074A12.062,12.062,0,0,1,9.139,25.1a.4.4,0,0,0-.343-.047L4.767,26.329l1.3-3.838a.4.4,0,0,0-.056-.367,11.8,11.8,0,0,1-2.3-7.013A12.06,12.06,0,1,1,15.775,27.074Z'
          fill={color}
        />
      </g>
      <text
        id='phoneNumber'
        data-name={phoneNumber}
        fill={color}
        font-size='25'
        font-family='var(--monospace-font-family)'
        font-weight='700'
      >
        <tspan
          x='45'
          y='22'
        >
          {phoneNumber}
        </tspan>
      </text>
    </g>
  );
};

const EmailContact = (email: string, color: string) => {
  return (
    <g
      id='Email_Contact'
      data-name='Email Contact'
    >
      <path
        id='Email_Icon'
        data-name='Email Icon'
        d='M6.947,37.7a4.2,4.2,0,0,1-4.2-4.217V10.962A4.149,4.149,0,0,1,3.978,7.956,4,4,0,0,1,6.947,6.7H36.508A4.073,4.073,0,0,1,39.5,7.956a4.111,4.111,0,0,1,1.25,3.006V33.483a4.037,4.037,0,0,1-1.25,2.983A4.11,4.11,0,0,1,36.508,37.7Zm14.78-13.683a1.817,1.817,0,0,0,.58-.09,3.265,3.265,0,0,0,.58-.269L35.883,14.91a1.372,1.372,0,0,0,.424-.449,1.3,1.3,0,0,0,.2-.718,1.5,1.5,0,0,0-.737-1.3,1.215,1.215,0,0,0-1.5.045L21.728,20.742l-12.5-8.255a1.4,1.4,0,0,0-1.518-.09,1.367,1.367,0,0,0-.759,1.3,1.208,1.208,0,0,0,.223.718,2.45,2.45,0,0,0,.447.493l12.949,8.748a3.265,3.265,0,0,0,.58.269A1.817,1.817,0,0,0,21.728,24.017Z'
        transform='translate(0 -7)'
        fill={color}
      />
      <text
        id='email'
        data-name={email}
        fill={color}
        font-size='25'
        font-family='var(--monospace-font-family)'
        font-weight='700'
      >
        <tspan
          x='55'
          y='22'
        >
          {email}
        </tspan>
      </text>
    </g>
  );
};

const ContactInfo = ({
  contactInfo,
  textColor,
}: {
  contactInfo: { type: string; value: string }[];
  textColor: string;
}) => {
  const contactInfoMap: any = {
    discord: DiscordContact,
    phone: PhoneContact,
    email: EmailContact,
  };

  const iconWidth = 45;
  const charWidth = 15;
  const margin = 45;

  let offset = 0;

  // Filter out blank contact info
  contactInfo = contactInfo.filter((contact) => contact.value !== '');

  // Construct the contact info
  const contactInfos = contactInfo.map((contact, index) => {
    const spacing = contact.value.length * charWidth + iconWidth + margin;
    const prevOffset = offset;
    offset += spacing;

    return (
      <g
        key={index}
        transform={`translate(${prevOffset} 0)`}
      >
        {contactInfoMap[contact.type](contact.value, textColor)}
      </g>
    );
  });

  return (
    <g
      id='Contact_Info'
      data-name='Contact Info'
      transform={`translate(${702 - offset / 2} 1810)`}
    >
      {contactInfos}
    </g>
  );
};

export default ContactInfo;
