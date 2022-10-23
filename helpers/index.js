import { deleteType } from './deleteDocsByFilter'

const sanityClient = require('@sanity/client')
function transformMunicipality(externalMunicipality, i) {
    const municipality = {
        _id: externalMunicipality.navn.toLowerCase()
            //Remove spaces
            .replace(/\s+/g, "-")
            //Remove special characters
            .replace(/[æ]/g, "ae")
            .replace(/[ø]/g, "oe")
            .replace(/[å]/g, "aa")
            .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ""),
        _type: 'municipality',
        title: externalMunicipality.navn,
    }
    return municipality
}
function transformGroup(externalGroup) {
    const group = {
        _id: `group-${externalGroup.name.toLowerCase()
            //Remove spaces
            .replace(/\s+/g, "-")
            //Remove special characters
            .replace(/[æ]/g, "ae")
            .replace(/[ø]/g, "oe")
            .replace(/[å]/g, "aa")
            .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")}`,
        _type: 'group',
        type: externalGroup.grouptype,
        municipality: {
            _type: 'reference', _ref: externalGroup.municipality.toLowerCase()
                //Remove spaces
                .replace(/\s+/g, "-")
                //Remove special characters
                .replace(/[æ]/g, "ae")
                .replace(/[ø]/g, "oe")
                .replace(/[å]/g, "aa")
                .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ""),
            },
        facebook: externalGroup.grouplinks[0]?.url || '',
        title: externalGroup.name,
    }
    return group
}
const client = sanityClient({
    projectId: 'rl6lxqo9',
    dataset: 'production',
    // a token with write access
    token: 'skTUs9BvCpQ0gkjgPZ8fxxXytazDHtP28Sp8RvwdGjz3ksqGM1yPiv7I6kbI1NmLdLgt93vdr6PgsftgBwdkVrKYTIaWt4M7we9xmlV0treGBlVJ0VHG1GjhPg0yr0XrR96cJ5xLOGygD5aHIjQzSCdmXU92NaOtXjqOdla2xqCNm3OkYAFH',
    useCdn: false
})


export const getMunicipalities = async () => {
    const DAWAURL = 'https://api.dataforsyningen.dk/kommuner'
    const data = await fetch(DAWAURL)
    const json = await data?.json()
    const arr = json.map(transformMunicipality)
    const existsQuery = `*[_type == 'municipality']{_id}`
    const existingMunicipalities = await client.fetch(existsQuery)
    const missingMunicipalities = arr.filter(m => !existingMunicipalities.map(m => m._id).includes(m._id))
    // console.log('municipalities: ', arr)
    // console.log(existingMunicipalities)
    console.log(missingMunicipalities)

    
    // missingMunicipalities.map(m => client.create(m))
    // arr.map(m => client.create(m))
}

export const importRESTData = async () => {
    const RESTURL = 'https://omstilmig.nu/API/group/api/v1/groups'
    const data = await fetch(RESTURL)
    const json = await data?.json()
    const arr = json.map(transformGroup)
    const existsQuery = `*[_type == 'group']{_id}`
    const existingGroups = await client.fetch(existsQuery)
    const missingGroups = arr.filter(g => !existingGroups.map(g => g._id).includes(g._id))
    // console.log('groups: ', arr)
    console.log('missing groups: ', missingGroups)

    // missingGroups.map(m => client.create(m))
    // arr.map(m => client.create(m))
} 

const reset = () => {
    // deleteType('municipality')

    // deleteType('group')

    // getMunicipalities()

    // importRESTData()
}

// getMunicipalities()


/**
 * UNCOMMENT TO RESET GROUPS - QUITE DISRUPTIVE
 */
// reset()