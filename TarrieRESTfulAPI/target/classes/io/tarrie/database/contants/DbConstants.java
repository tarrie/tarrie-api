package io.tarrie.database.contants;

import com.amazonaws.regions.Regions;
import software.amazon.awssdk.regions.Region;

import java.util.Arrays;
import java.util.HashSet;

public class DbConstants {
  public static final String BASE_TABLE = "tarrie.io";
    public static final String DEFAULT_EVENT_IMG =
      "https://s3.us-east-2.amazonaws.com/tarrie.io/events/pictures/default-event-profile.png";
  public static final String DEFAULT_USER_IMG =
      "https://s3.us-east-2.amazonaws.com/tarrie.io/users/pictures/default-user-profile.png";
  public static final String DEFAULT_GROUP_IMG =
      "https://s3.us-east-2.amazonaws.com/tarrie.io/groups/pictures/default-group-profile.png";
  public static final Regions DYNAMO_DB_REGION = Regions.US_EAST_2;
  public static final Regions S3_REGION = Regions.US_EAST_2;
  public static final HashSet<String> ACCEPTABLE_MIME_IMAGES =
      new HashSet<String>(Arrays.asList("image/gif", "image/jpg", "image/jpeg", "image/png"));
  public static final String IMG_S3_BUCKET = "tarrie.io";
    public static final String S3_HOSTNAME = "https://s3.us-east-2.amazonaws.com/"+IMG_S3_BUCKET;

}
