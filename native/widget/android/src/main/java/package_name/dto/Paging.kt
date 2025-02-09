package package_name

import kotlinx.serialization.Serializable

@Serializable
data class Paging(val page: Int, val pageSize: Int, val maxSize: Int, val total: Int)