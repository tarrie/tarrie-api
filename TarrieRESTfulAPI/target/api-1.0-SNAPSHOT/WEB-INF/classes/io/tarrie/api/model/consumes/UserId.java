package io.tarrie.api.model.consumes;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

@ApiModel
public class UserId {

    @ApiModelProperty(value = "The id of the user")
    @NotNull
    public String userId;
}
